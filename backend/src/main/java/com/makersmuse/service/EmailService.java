package com.makersmuse.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@makersmuse.com}")
    private String fromEmail;

    @Async
    public void sendOtpEmail(String toEmail, String otp) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(fromEmail);
            msg.setTo(toEmail);
            msg.setSubject("Makers Muse — Password Reset OTP");
            msg.setText("""
                    Hi there,
                    
                    Your password reset OTP is: %s
                    
                    This code expires in 15 minutes.
                    
                    If you didn't request this, please ignore this email.
                    
                    — Makers Muse Team
                    """.formatted(otp));
            mailSender.send(msg);
            log.info("OTP email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendContactConfirmation(String toEmail, String name) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(fromEmail);
            msg.setTo(toEmail);
            msg.setSubject("Makers Muse — We received your message");
            msg.setText("""
                    Hi %s,
                    
                    Thank you for reaching out! We've received your message and will get back to you within 24 hours.
                    
                    — Makers Muse Team
                    """.formatted(name));
            mailSender.send(msg);
        } catch (Exception e) {
            log.error("Failed to send contact confirmation to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendPurchaseConfirmation(String toEmail, String artworkTitle, String downloadToken) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(fromEmail);
            msg.setTo(toEmail);
            msg.setSubject("Makers Muse — Your purchase: " + artworkTitle);
            msg.setText("""
                    Thank you for your purchase!
                    
                    Artwork: %s
                    
                    Download link: http://localhost:5173/download/%s
                    (Valid for 24 hours, up to 3 downloads)
                    
                    — Makers Muse Team
                    """.formatted(artworkTitle, downloadToken));
            mailSender.send(msg);
        } catch (Exception e) {
            log.error("Failed to send purchase confirmation: {}", e.getMessage());
        }
    }
}
