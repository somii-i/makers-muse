package com.makersmuse.service;

import com.makersmuse.entity.Artwork;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
public class MockPaymentService {

    public String createMockCheckoutSession(List<Artwork> artworks, Map<Long, Integer> quantities, Long orderId) {
        // Generate a fake session ID
        String sessionId = "mock_session_" + UUID.randomUUID().toString();
        log.info("Created Mock Checkout Session: {} for order: {}", sessionId, orderId);
        
        // Return a mock URL that the frontend will intercept and redirect to the mock checkout page
        return "/mock-checkout?orderId=" + orderId + "&sessionId=" + sessionId;
    }
}
