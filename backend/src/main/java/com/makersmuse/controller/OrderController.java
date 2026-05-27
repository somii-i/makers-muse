package com.makersmuse.controller;

import com.makersmuse.dto.CheckoutRequest;
import com.makersmuse.dto.OrderDto;
import com.makersmuse.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /**
     * POST /api/orders/checkout
     * Accepts cart items, creates a pending order, returns the Stripe checkout URL.
     * ROLE_CUSTOMER only.
     */
    @PostMapping("/checkout")
    public ResponseEntity<Map<String, String>> checkout(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CheckoutRequest request
    ) throws Exception {
        String checkoutUrl = orderService.initiateCheckout(userDetails.getUsername(), request);
        return ResponseEntity.ok(Map.of("checkoutUrl", checkoutUrl));
    }

    /**
     * GET /api/orders/my
     * Returns orders placed by the current customer.
     */
    @GetMapping("/my")
    public ResponseEntity<Page<OrderDto>> getMyOrders(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(orderService.getMyOrders(userDetails.getUsername(), page, size));
    }

    /**
     * GET /api/orders/{orderId}/download/{itemId}
     * Generates a time-limited presigned S3 URL for downloading a digital artwork.
     * ROLE_CUSTOMER only, order must belong to requesting user and be COMPLETED.
     */
    @GetMapping("/{orderId}/download/{itemId}")
    public ResponseEntity<Map<String, String>> getDownloadUrl(
            @PathVariable Long orderId,
            @PathVariable Long itemId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String url = orderService.getDownloadUrl(orderId, itemId, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("downloadUrl", url));
    }

    /**
     * POST /api/orders/{orderId}/mock-success
     * Fulfills an order using the mock payment system.
     * ROLE_CUSTOMER only.
     */
    @PostMapping("/{orderId}/mock-success")
    public ResponseEntity<Void> completeMockOrder(
            @PathVariable Long orderId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        // Find the stripe session ID for this order, which we mocked as mock_session_{orderId}
        orderService.fulfillOrder("mock_session_" + orderId);
        return ResponseEntity.ok().build();
    }
}
