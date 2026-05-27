package com.makersmuse.controller;

import com.makersmuse.service.ChatService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @Data
    public static class ChatRequest {
        private String message;
        private String sessionId;
    }

    /**
     * POST /api/chat
     * Public endpoint — no auth required so anyone can use the chatbot.
     * Body: { message: "...", sessionId: "..." (optional) }
     */
    @PostMapping
    public ResponseEntity<Map<String, String>> chat(@RequestBody ChatRequest request) {
        String sessionId = request.getSessionId() != null
                ? request.getSessionId()
                : UUID.randomUUID().toString();

        if (request.getMessage() == null || request.getMessage().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Message cannot be empty"));
        }

        String reply = chatService.chat(sessionId, request.getMessage());
        return ResponseEntity.ok(Map.of(
                "reply", reply,
                "sessionId", sessionId
        ));
    }
}
