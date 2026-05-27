package com.makersmuse.service;

import com.makersmuse.entity.Order;
import com.makersmuse.enums.PaymentStatus;
import com.makersmuse.repository.OrderRepository;
import com.makersmuse.repository.UserRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EarningsService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Data
    @Builder
    public static class EarningsSummary {
        private BigDecimal totalEarnings;
        private Long totalOrders;
        private BigDecimal thisMonthEarnings;
        private List<RecentSale> recentSales;
    }

    @Data
    @Builder
    public static class RecentSale {
        private Long orderId;
        private String artworkTitle;
        private BigDecimal amount;
        private String buyerEmail;
        private String soldAt;
    }

    public EarningsSummary getEarnings(String artistEmail) {
        var artist = userRepository.findByEmail(artistEmail)
                .orElseThrow(() -> new RuntimeException("Artist not found"));

        // Get all completed orders containing this artist's artworks
        var allOrders = orderRepository.findAll().stream()
                .filter(o -> o.getPaymentStatus() == PaymentStatus.COMPLETED)
                .filter(o -> o.getItems().stream()
                        .anyMatch(item -> item.getArtwork().getArtist().getId().equals(artist.getId())))
                .toList();

        BigDecimal total = allOrders.stream()
                .flatMap(o -> o.getItems().stream())
                .filter(item -> item.getArtwork().getArtist().getId().equals(artist.getId()))
                .map(item -> item.getPurchasePrice())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // This month
        var now = java.time.LocalDate.now();
        BigDecimal thisMonth = allOrders.stream()
                .filter(o -> o.getCreatedAt().getMonth() == now.getMonth()
                        && o.getCreatedAt().getYear() == now.getYear())
                .flatMap(o -> o.getItems().stream())
                .filter(item -> item.getArtwork().getArtist().getId().equals(artist.getId()))
                .map(item -> item.getPurchasePrice())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<RecentSale> recentSales = allOrders.stream()
                .limit(10)
                .flatMap(o -> o.getItems().stream()
                        .filter(item -> item.getArtwork().getArtist().getId().equals(artist.getId()))
                        .map(item -> RecentSale.builder()
                                .orderId(o.getId())
                                .artworkTitle(item.getArtwork().getTitle())
                                .amount(item.getPurchasePrice())
                                .buyerEmail(o.getCustomer().getEmail().split("@")[0] + "@***")
                                .soldAt(o.getCreatedAt().toString())
                                .build()))
                .toList();

        return EarningsSummary.builder()
                .totalEarnings(total)
                .totalOrders((long) allOrders.size())
                .thisMonthEarnings(thisMonth)
                .recentSales(recentSales)
                .build();
    }
}
