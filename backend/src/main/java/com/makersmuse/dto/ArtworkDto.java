package com.makersmuse.dto;

import com.makersmuse.enums.ArtCategory;
import com.makersmuse.enums.LicenseType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ArtworkDto {
    private Long id;
    private Long artistId;
    private String artistEmail;
    private String title;
    private String description;
    private BigDecimal price;
    private String thumbnailUrl;
    private ArtCategory category;
    private LicenseType licenseType;
    private String dimensions;
    private Integer stockCount;
    private LocalDateTime createdAt;
}
