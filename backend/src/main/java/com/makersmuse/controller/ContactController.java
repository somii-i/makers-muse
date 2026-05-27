package com.makersmuse.controller;

import com.makersmuse.entity.ContactMessage;
import com.makersmuse.repository.ContactMessageRepository;
import com.makersmuse.service.EmailService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactMessageRepository contactRepo;
    private final EmailService emailService;

    @Data
    public static class ContactRequest {
        @NotBlank private String name;
        @NotBlank @Email private String email;
        @NotBlank @Size(max = 200) private String subject;
        @NotBlank @Size(max = 2000) private String message;
    }

    /** POST /api/contact — public */
    @PostMapping
    public ResponseEntity<Map<String, String>> submit(@Valid @RequestBody ContactRequest req) {
        ContactMessage msg = ContactMessage.builder()
                .name(req.getName())
                .email(req.getEmail())
                .subject(req.getSubject())
                .message(req.getMessage())
                .build();
        contactRepo.save(msg);
        emailService.sendContactConfirmation(req.getEmail(), req.getName());
        return ResponseEntity.ok(Map.of("message", "Thank you! We'll get back to you within 24 hours."));
    }
}
