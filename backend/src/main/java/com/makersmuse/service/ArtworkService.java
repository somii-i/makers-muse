package com.makersmuse.service;

import com.makersmuse.dto.ArtworkDto;
import com.makersmuse.entity.Artwork;
import com.makersmuse.entity.User;
import com.makersmuse.enums.ArtCategory;
import com.makersmuse.enums.LicenseType;
import com.makersmuse.repository.ArtworkRepository;
import com.makersmuse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class ArtworkService {

    private final ArtworkRepository artworkRepository;
    private final UserRepository userRepository;
    private final LocalStorageService localStorageService;
    private final CloudinaryService cloudinaryService;

    /**
     * Uploads a new artwork — stores high-res in private S3, thumbnail in public S3.
     */
    @Transactional
    public ArtworkDto uploadArtwork(
            String artistEmail,
            String title,
            String description,
            BigDecimal price,
            String dimensions,
            ArtCategory category,
            LicenseType licenseType,
            Integer stockCount,
            MultipartFile file
    ) throws Exception {

        User artist = userRepository.findByEmail(artistEmail)
                .orElseThrow(() -> new RuntimeException("Artist not found: " + artistEmail));

        // First save the artwork entity to get its ID for S3 path naming
        Artwork artwork = Artwork.builder()
                .artist(artist)
                .title(title)
                .description(description)
                .price(price)
                .dimensions(dimensions)
                .category(category)
                .licenseType(licenseType)
                .stockCount(stockCount != null ? stockCount : 1)
                .thumbnailUrl("pending")   // temporary placeholder
                .highResKey("pending")
                .build();
        artwork = artworkRepository.save(artwork);

        // Upload to Cloudinary (production) or local disk (dev)
        String thumbnailUrl;
        String highResKey;

        if (cloudinaryService.isEnabled()) {
            String folder = "makers-muse";
            thumbnailUrl = cloudinaryService.uploadImage(
                    file, folder + "/thumbnails", "artwork_" + artwork.getId() + "_thumb");
            highResKey = cloudinaryService.uploadHighRes(
                    file, folder + "/highres", "artwork_" + artwork.getId() + "_highres");
        } else {
            // Fallback: save to local disk (dev only)
            highResKey = localStorageService.uploadHighRes(file, artwork.getId());
            thumbnailUrl = localStorageService.uploadThumbnail(file, artwork.getId());
        }

        // Update with real URLs
        artwork.setHighResKey(highResKey);
        artwork.setThumbnailUrl(thumbnailUrl);
        artwork = artworkRepository.save(artwork);

        log.info("Artwork {} uploaded by artist {}", artwork.getId(), artistEmail);
        return toDto(artwork);
    }

    /**
     * Public search — keyword, category, price range, paginated.
     */
    public Page<ArtworkDto> search(
            String keyword,
            ArtCategory category,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            int page,
            int size,
            String sortBy
    ) {
        Sort sort = switch (sortBy) {
            case "price_asc"  -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            default           -> Sort.by("createdAt").descending();
        };
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Artwork> spec = Specification.where((root, query, cb) -> 
            cb.equal(root.get("active"), true)
        );

        if (keyword != null && !keyword.isBlank()) {
            String kw = "%" + keyword.toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("title")), kw),
                    cb.like(cb.lower(root.get("description")), kw)
            ));
        }
        if (category != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category"), category));
        }
        if (minPrice != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("price"), minPrice));
        }
        if (maxPrice != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("price"), maxPrice));
        }

        return artworkRepository.findAll(spec, pageable).map(this::toDto);
    }

    /**
     * Returns artworks owned by the current artist.
     */
    public Page<ArtworkDto> getMyArtworks(String artistEmail, int page, int size) {
        User artist = userRepository.findByEmail(artistEmail)
                .orElseThrow(() -> new RuntimeException("Artist not found"));
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return artworkRepository.findByArtistIdAndActiveTrue(artist.getId(), pageable)
                .map(this::toDto);
    }

    /**
     * Fetches single artwork (public).
     */
    public ArtworkDto getById(Long id) {
        return artworkRepository.findById(id)
                .filter(Artwork::getActive)
                .map(this::toDto)
                .orElseThrow(() -> new RuntimeException("Artwork not found: " + id));
    }

    /**
     * Soft-deletes artwork — only allowed by the owning artist.
     */
    @Transactional
    public void deleteArtwork(Long artworkId, String artistEmail) {
        Artwork artwork = artworkRepository.findById(artworkId)
                .orElseThrow(() -> new RuntimeException("Artwork not found: " + artworkId));

        if (!artwork.getArtist().getEmail().equals(artistEmail)) {
            throw new AccessDeniedException("You do not own this artwork");
        }

        artwork.setActive(false);
        artworkRepository.save(artwork);
        log.info("Artwork {} soft-deleted by {}", artworkId, artistEmail);
    }

    /** Maps entity → DTO (never exposes the private S3 key). */
    public ArtworkDto toDto(Artwork a) {
        return ArtworkDto.builder()
                .id(a.getId())
                .artistId(a.getArtist().getId())
                .artistEmail(a.getArtist().getEmail())
                .title(a.getTitle())
                .description(a.getDescription())
                .price(a.getPrice())
                .thumbnailUrl(a.getThumbnailUrl())
                .category(a.getCategory())
                .licenseType(a.getLicenseType())
                .dimensions(a.getDimensions())
                .stockCount(a.getStockCount())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
