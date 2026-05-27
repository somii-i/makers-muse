package com.makersmuse.service;

import com.makersmuse.entity.DownloadToken;
import com.makersmuse.entity.OrderItem;
import com.makersmuse.repository.DownloadTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class DownloadTokenService {

    private final DownloadTokenRepository downloadTokenRepository;
    private final LocalStorageService localStorageService;

    @Value("${download.token.validity-hours:24}")
    private int validityHours;

    @Value("${download.token.max-uses:3}")
    private int maxUses;

    /**
     * Creates a download token for a given order item (called after payment completes).
     */
    @Transactional
    public DownloadToken createToken(OrderItem orderItem) {
        DownloadToken token = DownloadToken.builder()
                .orderItem(orderItem)
                .expiresAt(LocalDateTime.now().plusHours(validityHours))
                .maxUsage(maxUses)
                .build();
        return downloadTokenRepository.save(token);
    }

    /**
     * Validates a token and returns a presigned S3 URL.
     * Increments the usage count. Throws if expired or exhausted.
     */
    @Transactional
    public String redeemToken(String tokenValue) {
        DownloadToken token = downloadTokenRepository.findByToken(tokenValue)
                .orElseThrow(() -> new RuntimeException("Download token not found or already used"));

        if (!token.isValid()) {
            throw new RuntimeException("Download link has expired or reached its usage limit");
        }

        token.setUsageCount(token.getUsageCount() + 1);
        downloadTokenRepository.save(token);

        String highResKey = token.getOrderItem().getArtwork().getHighResKey();
        log.info("Download redeemed for artwork key: {}, uses: {}/{}", 
                highResKey, token.getUsageCount(), token.getMaxUsage());
        return localStorageService.generatePresignedUrl(highResKey);
    }
}
