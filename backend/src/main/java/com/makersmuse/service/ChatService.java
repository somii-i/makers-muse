package com.makersmuse.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    @Value("${GEMINI_API_KEY:}")
    private String geminiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final Map<String, String> sessionHistory = new ConcurrentHashMap<>();

    private static final String SYSTEM_PROMPT = """
            You are Muse, the friendly AI assistant for Makers Muse — a digital art marketplace.
            
            You help:
            - Buyers discover art by describing what they're looking for (style, mood, color, budget)
            - Sellers with tips on pricing, descriptions, and uploading their work
            - Everyone with questions about payments, downloads, accounts, and policies
            
            Our platform supports 20 art categories: PORTRAITS,PHOTOGRAPHY, SCULPTURE_CERAMICS,RESIN_ART, CROCHET_ART,CANDLE,JEWELERY,OTHERS
            
            Payments are secured by Stripe. Digital downloads are available immediately after purchase,
            with links valid for 24 hours and up to 3 downloads.
            
            Keep responses concise, friendly, and helpful. If asked about specific artworks you don't know about,
            suggest using the search and filter features on the marketplace.
            """;

    public String chat(String sessionId, String userMessage) {
        try {
            if (geminiApiKey == null || geminiApiKey.trim().isEmpty() || geminiApiKey.contains("your-actual-")) {
                return "Gemini API Key is missing. Please add GEMINI_API_KEY to your .env file.";
            }

            // gemini-2.5-flash — the latest free model available
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> requestBody = Map.of(
                    "systemInstruction", Map.of(
                            "parts", List.of(Map.of("text", SYSTEM_PROMPT))
                    ),
                    "contents", List.of(
                            Map.of("parts", List.of(Map.of("text", userMessage)))
                    )
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    if (!parts.isEmpty()) {
                        String reply = (String) parts.get(0).get("text");
                        log.debug("Chat [{}]: {} -> {}", sessionId, userMessage, reply);
                        return reply;
                    }
                }
            }

            return "Muse is thinking... but couldn't formulate a response.";

        } catch (Exception e) {
            log.error("Chat error for session {}: {}", sessionId, e.getMessage());
            return "Gemini Connection Error: " + e.getMessage();
        }
    }
}
