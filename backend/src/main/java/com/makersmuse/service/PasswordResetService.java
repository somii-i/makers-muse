package com.makersmuse.service;

import com.makersmuse.entity.PasswordResetToken;
import com.makersmuse.entity.User;
import com.makersmuse.repository.PasswordResetTokenRepository;
import com.makersmuse.repository.UserRepository;
import com.makersmuse.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    private final SecureRandom random = new SecureRandom();

    /**
     * Sends a 6-digit OTP to the user's email if the account exists.
     * Always returns success to prevent email enumeration.
     */
    @Transactional
    public void sendOtp(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            // Invalidate any existing tokens
            tokenRepository.deleteByUserId(user.getId());

            String otp = String.format("%06d", random.nextInt(1_000_000));
            PasswordResetToken token = PasswordResetToken.builder()
                    .user(user)
                    .otp(otp)
                    .expiresAt(LocalDateTime.now().plusMinutes(15))
                    .build();
            tokenRepository.save(token);
            emailService.sendOtpEmail(email, otp);
            log.info("OTP sent for password reset to {}", email);
        });
    }

    /**
     * Verifies OTP and resets the password. Returns a new JWT on success.
     */
    @Transactional
    public String resetPassword(String email, String otp, String newPassword) {
        PasswordResetToken token = tokenRepository
                .findByOtpAndUserEmailAndUsedFalse(otp, email)
                .orElseThrow(() -> new RuntimeException("Invalid or expired OTP"));

        if (!token.isValid()) {
            throw new RuntimeException("OTP has expired. Please request a new one.");
        }

        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        token.setUsed(true);
        tokenRepository.save(token);

        // Return a new JWT so the user is automatically logged in
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        return jwtUtil.generateToken(userDetails);
    }
}
