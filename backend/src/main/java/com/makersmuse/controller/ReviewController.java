package com.makersmuse.controller;

import com.makersmuse.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/artworks/{artworkId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /** GET /api/artworks/{id}/reviews — public */
    @GetMapping
    public ResponseEntity<ReviewService.ReviewSummary> getReviews(
            @PathVariable Long artworkId,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(reviewService.getReviews(artworkId, page, size));
    }

    /** POST /api/artworks/{id}/reviews — ROLE_CUSTOMER only */
    @PostMapping
    public ResponseEntity<ReviewService.ReviewDto> addReview(
            @PathVariable Long artworkId,
            @RequestBody ReviewService.ReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewService.addReview(artworkId, userDetails.getUsername(), request));
    }
}
