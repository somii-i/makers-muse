package com.makersmuse.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ChatClient.Builder chatClientBuilder;

    // In-memory session store (use Redis in production)
    private final Map<String, String> sessionHistory = new ConcurrentHashMap<>();

    private static final String SYSTEM_PROMPT = """
            You are Muse, the friendly AI assistant for Makers Muse — a digital art marketplace.
            
            You help:
            - Buyers discover art by describing what they're looking for (style, mood, color, budget)
            - Sellers with tips on pricing, descriptions, and uploading their work
            - Everyone with questions about payments, downloads, accounts, and policies
            
            Our platform supports 20 art categories: Oil Painting, Watercolor, Digital Illustration, 3D Render,
            Abstract Art, Photography, Pixel Art, Pop Art, Sculpture & Ceramics, Typography & Calligraphy,
            Concept Art, Vector Graphics, Minimalist Art, Anime & Manga, Cyberpunk/Sci-Fi, Fantasy Art,
            Street Art & Graffiti, AI Generated Art, Textures & Patterns, and Mixed Media.
            
            Payments are secured by Stripe. Digital downloads are available immediately after purchase,
            with links valid for 24 hours and up to 3 downloads.
            
            Keep responses concise, friendly, and helpful. If asked about specific artworks you don't know about,
            suggest using the search and filter features on the marketplace.
            """;

    /**
     * Sends a message to the AI and returns the response.
     * sessionId is used to maintain per-user context (simplified in-memory).
     */
    public String chat(String sessionId, String userMessage) {
        try {
            ChatClient chatClient = chatClientBuilder.build();

            String response = chatClient.prompt()
                    .system(SYSTEM_PROMPT)
                    .user(userMessage)
                    .call()
                    .content();

            log.debug("Chat [{}]: {} -> {}", sessionId, userMessage.substring(0, Math.min(50, userMessage.length())), response.substring(0, Math.min(80, response.length())));
            return response;

        } catch (Exception e) {
            log.error("Chat error for session {}: {}", sessionId, e.getMessage());
            return "OpenAI Connection Error: " + e.getMessage() + ". (Check your backend console for more details)";
        }
    }
}
