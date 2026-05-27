package com.makersmuse.controller;

import com.makersmuse.service.PasswordResetService;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    @Data
    public static class ForgotRequest {
        @NotBlank @Email
        private String email;
    }

    @Data
    public static class ResetRequest {
        @NotBlank @Email private String email;
        @NotBlank @Size(min = 6, max = 6) private String otp;
        @NotBlank @Size(min = 8) private String newPassword;
    }

    /** POST /api/auth/forgot-password — public */
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody ForgotRequest req) {
        passwordResetService.sendOtp(req.getEmail());
        // Always return 200 to prevent email enumeration
        return ResponseEntity.ok(Map.of("message",
                "If this email exists, a reset code has been sent."));
    }

    /** POST /api/auth/reset-password — public */
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody ResetRequest req) {
        String token = passwordResetService.resetPassword(req.getEmail(), req.getOtp(), req.getNewPassword());
        return ResponseEntity.ok(Map.of("token", token, "message", "Password reset successfully"));
    }
}
