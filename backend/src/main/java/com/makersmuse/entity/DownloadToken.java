package com.makersmuse.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "download_tokens",
        indexes = {
            @Index(name = "idx_dl_token", columnList = "token"),
            @Index(name = "idx_dl_order_item", columnList = "order_item_id")
        })
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class DownloadToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_item_id", nullable = false)
    private OrderItem orderItem;

    @Column(nullable = false, unique = true, length = 36)
    @Builder.Default
    private String token = UUID.randomUUID().toString();

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    @Builder.Default
    private Integer usageCount = 0;

    @Column(nullable = false)
    private Integer maxUsage;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public boolean isValid() {
        return LocalDateTime.now().isBefore(expiresAt) && usageCount < maxUsage;
    }
}
