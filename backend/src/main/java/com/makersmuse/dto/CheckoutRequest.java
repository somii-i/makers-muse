package com.makersmuse.dto;

import lombok.Data;

import java.util.List;

@Data
public class CheckoutRequest {
    /** Each item in the cart */
    private List<CartItem> items;

    @Data
    public static class CartItem {
        private Long artworkId;
        private int quantity;
    }
}
