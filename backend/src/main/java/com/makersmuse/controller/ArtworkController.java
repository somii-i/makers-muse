package com.makersmuse.controller;

import com.makersmuse.dto.ArtworkDto;
import com.makersmuse.enums.ArtCategory;
import com.makersmuse.enums.LicenseType;
import com.makersmuse.service.ArtworkService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/artworks")
@RequiredArgsConstructor
public class ArtworkController {

    private final ArtworkService artworkService;

    // ── Artist Endpoints ─────────────────────────────────────────────────────

    /**
     * POST /api/artworks
     * Multipart form upload — ROLE_ARTIST only.
     * Fields: file, title, description, price, dimensions, category, licenseType, stockCount
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ArtworkDto> upload(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file")         MultipartFile file,
            @RequestParam("title")        String title,
            @RequestParam("description")  String description,
            @RequestParam("price")        BigDecimal price,
            @RequestParam(value = "dimensions", required = false) String dimensions,
            @RequestParam("category")     ArtCategory category,
            @RequestParam("licenseType")  LicenseType licenseType,
            @RequestParam(value = "stockCount", defaultValue = "1") Integer stockCount
    ) throws Exception {
        ArtworkDto dto = artworkService.uploadArtwork(
                userDetails.getUsername(), title, description, price,
                dimensions, category, licenseType, stockCount, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    /**
     * GET /api/artworks/my
     * Returns artworks uploaded by the authenticated artist.
     */
    @GetMapping("/my")
    public ResponseEntity<Page<ArtworkDto>> getMyArtworks(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        return ResponseEntity.ok(artworkService.getMyArtworks(userDetails.getUsername(), page, size));
    }

    /**
     * DELETE /api/artworks/{id}
     * Soft-deletes the artwork — ROLE_ARTIST only and must own the artwork.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        artworkService.deleteArtwork(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    // ── Public Endpoints ─────────────────────────────────────────────────────

    /**
     * GET /api/artworks
     * Public search with optional keyword, category, price range, pagination, and sorting.
     * Query params: keyword, category, minPrice, maxPrice, page, size, sort
     */
    @GetMapping
    public ResponseEntity<Page<ArtworkDto>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) ArtCategory category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0")   int page,
            @RequestParam(defaultValue = "12")  int size,
            @RequestParam(defaultValue = "newest") String sort
    ) {
        return ResponseEntity.ok(
                artworkService.search(keyword, category, minPrice, maxPrice, page, size, sort));
    }

    /**
     * GET /api/artworks/{id}
     * Returns a single artwork's public details.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ArtworkDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(artworkService.getById(id));
    }
}
