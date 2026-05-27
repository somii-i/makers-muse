package com.makersmuse.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "artist_profiles")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ArtistProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String bio;

    /** Stripe Connect Account ID (e.g., acct_xxx) — set during onboarding */
    @Column(length = 100)
    private String stripeConnectId;

    @Column(precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal balance = BigDecimal.ZERO;
}
