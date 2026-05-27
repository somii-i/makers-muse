package com.makersmuse.repository;

import com.makersmuse.entity.DownloadToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DownloadTokenRepository extends JpaRepository<DownloadToken, Long> {
    Optional<DownloadToken> findByToken(String token);
    void deleteByOrderItemId(Long orderItemId);
}
