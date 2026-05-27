package com.makersmuse.repository;

import com.makersmuse.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByOtpAndUserEmailAndUsedFalse(String otp, String email);
    void deleteByUserId(Long userId);
}
