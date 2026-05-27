package com.makersmuse.controller;

import com.makersmuse.entity.NewsletterSubscriber;
import com.makersmuse.repository.NewsletterRepository;
import jakarta.validation.constraints.Email;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/newsletter")
@RequiredArgsConstructor
public class NewsletterController {

    private final NewsletterRepository newsletterRepo;

    @Data
    public static class SubscribeRequest {
        @Email private String email;
    }

    /** POST /api/newsletter/subscribe — public */
    @PostMapping("/subscribe")
    public ResponseEntity<Map<String, String>> subscribe(@RequestBody SubscribeRequest req) {
        if (newsletterRepo.existsByEmail(req.getEmail())) {
            return ResponseEntity.ok(Map.of("message", "You're already subscribed!"));
        }
        newsletterRepo.save(NewsletterSubscriber.builder().email(req.getEmail()).build());
        return ResponseEntity.ok(Map.of("message", "Welcome to Makers Muse! 🎨"));
    }
}
