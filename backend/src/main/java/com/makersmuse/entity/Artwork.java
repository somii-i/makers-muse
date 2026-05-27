package com.makersmuse.entity;

import com.makersmuse.enums.ArtCategory;
import com.makersmuse.enums.LicenseType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "artworks",
        indexes = {
            @Index(name = "idx_artwork_category", columnList = "category"),
            @Index(name = "idx_artwork_artist",   columnList = "artist_id")
        })
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Artwork {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artist_id", nullable = false)
    private User artist;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    /** Public thumbnail URL (hosted on public S3 bucket) */
    @Column(nullable = false)
    private String thumbnailUrl;

    /** S3 object key for the private high-res file */
    @Column(nullable = false)
    private String highResKey;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ArtCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private LicenseType licenseType;

    /** E.g. "24x36 inches" */
    @Column(length = 100)
    private String dimensions;

    @Column(nullable = false)
    @Builder.Default
    private Integer stockCount = 1;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
