package com.makersmuse.dto;

import com.makersmuse.enums.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderDto {
    private Long id;
    private BigDecimal totalAmount;
    private PaymentStatus paymentStatus;
    private LocalDateTime createdAt;
    private List<OrderItemDto> items;

    @Data
    @Builder
    public static class OrderItemDto {
        private Long itemId;
        private Long artworkId;
        private String artworkTitle;
        private String thumbnailUrl;
        private BigDecimal purchasePrice;
        private String licenseType;
    }
}
