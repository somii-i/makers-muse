package com.makersmuse.service;

import com.makersmuse.dto.CheckoutRequest;
import com.makersmuse.dto.OrderDto;
import com.makersmuse.entity.Artwork;
import com.makersmuse.entity.DownloadToken;
import com.makersmuse.entity.Order;
import com.makersmuse.entity.OrderItem;
import com.makersmuse.entity.User;
import com.makersmuse.enums.LicenseType;
import com.makersmuse.enums.PaymentStatus;
import com.makersmuse.repository.ArtworkRepository;
import com.makersmuse.repository.OrderRepository;
import com.makersmuse.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ArtworkRepository artworkRepository;
    private final MockPaymentService mockPaymentService;
    private final LocalStorageService localStorageService;
    private final DownloadTokenService downloadTokenService;
    private final EmailService emailService;

    /**
     * Creates a pending Order, then initiates a Stripe Checkout Session.
     * Returns the Stripe-hosted checkout URL for frontend redirect.
     */
    @Transactional
    public String initiateCheckout(String customerEmail, CheckoutRequest request) throws Exception {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        List<Long> artworkIds = request.getItems().stream()
                .map(CheckoutRequest.CartItem::getArtworkId)
                .toList();

        List<Artwork> artworks = artworkRepository.findAllByIdIn(artworkIds);
        if (artworks.size() != artworkIds.size()) {
            throw new RuntimeException("One or more artworks not found");
        }

        Map<Long, Integer> quantities = new HashMap<>();
        for (CheckoutRequest.CartItem item : request.getItems()) {
            quantities.put(item.getArtworkId(), item.getQuantity());
        }

        BigDecimal total = artworks.stream()
                .map(a -> a.getPrice().multiply(BigDecimal.valueOf(quantities.getOrDefault(a.getId(), 1))))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Create the order in PENDING state
        Order order = Order.builder()
                .customer(customer)
                .totalAmount(total)
                .paymentStatus(PaymentStatus.PENDING)
                .build();

        for (Artwork artwork : artworks) {
            OrderItem item = OrderItem.builder()
                    .order(order)
                    .artwork(artwork)
                    .purchasePrice(artwork.getPrice())
                    .build();
            order.getItems().add(item);
        }

        order = orderRepository.save(order);

        // Create Mock session
        String mockUrl = mockPaymentService.createMockCheckoutSession(artworks, quantities, order.getId());
        // For mock, we can just save a fake session ID or use the order ID
        order.setStripeSessionId("mock_session_" + order.getId());
        orderRepository.save(order);

        return mockUrl;
    }

    /**
     * Called by the Stripe webhook handler to fulfill a completed payment.
     * Idempotent — safe to call multiple times with the same session.
     */
    @Transactional
    public void fulfillOrder(String stripeSessionId) {
        // Idempotency guard
        if (orderRepository.existsByStripeSessionIdAndPaymentStatus(stripeSessionId, PaymentStatus.COMPLETED)) {
            log.warn("Order for session {} already fulfilled, skipping", stripeSessionId);
            return;
        }

        Order order = orderRepository.findByStripeSessionId(stripeSessionId)
                .orElseThrow(() -> new RuntimeException("No order found for session: " + stripeSessionId));

        order.setPaymentStatus(PaymentStatus.COMPLETED);
        orderRepository.save(order);

        // Generate download tokens for digital items and send confirmation emails
        for (OrderItem item : order.getItems()) {
            if (item.getArtwork().getLicenseType() == LicenseType.DIGITAL) {
                DownloadToken token = downloadTokenService.createToken(item);
                emailService.sendPurchaseConfirmation(
                        order.getCustomer().getEmail(),
                        item.getArtwork().getTitle(),
                        token.getToken()
                );
            }
        }

        log.info("Order {} fulfilled for Stripe session {}", order.getId(), stripeSessionId);
    }

    /**
     * Returns the current customer's orders (paginated).
     */
    public Page<OrderDto> getMyOrders(String customerEmail, int page, int size) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(
                customer.getId(), PageRequest.of(page, size, Sort.by("createdAt").descending())
        ).map(this::toDto);
    }

    /**
     * Generates a presigned S3 download URL for a specific order item.
     * Only accessible if the order belongs to the requesting customer and payment is COMPLETED.
     */
    public String getDownloadUrl(Long orderId, Long itemId, String customerEmail) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getCustomer().getEmail().equals(customerEmail)) {
            throw new SecurityException("Access denied to order " + orderId);
        }
        if (order.getPaymentStatus() != PaymentStatus.COMPLETED) {
            throw new IllegalStateException("Order payment not completed");
        }

        OrderItem orderItem = order.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Order item not found"));

        Artwork artwork = orderItem.getArtwork();
        if (artwork.getLicenseType() != LicenseType.DIGITAL) {
            throw new IllegalStateException("This artwork does not support digital download");
        }

        return localStorageService.generatePresignedUrl(artwork.getHighResKey());
    }

    private OrderDto toDto(Order order) {
        List<OrderDto.OrderItemDto> itemDtos = order.getItems().stream()
                .map(i -> OrderDto.OrderItemDto.builder()
                        .itemId(i.getId())
                        .artworkId(i.getArtwork().getId())
                        .artworkTitle(i.getArtwork().getTitle())
                        .thumbnailUrl(i.getArtwork().getThumbnailUrl())
                        .purchasePrice(i.getPurchasePrice())
                        .licenseType(i.getArtwork().getLicenseType().name())
                        .build())
                .collect(Collectors.toList());

        return OrderDto.builder()
                .id(order.getId())
                .totalAmount(order.getTotalAmount())
                .paymentStatus(order.getPaymentStatus())
                .createdAt(order.getCreatedAt())
                .items(itemDtos)
                .build();
    }
}
