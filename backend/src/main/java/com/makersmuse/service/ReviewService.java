package com.makersmuse.service;

import com.makersmuse.entity.Artwork;
import com.makersmuse.entity.Review;
import com.makersmuse.entity.User;
import com.makersmuse.repository.ArtworkRepository;
import com.makersmuse.repository.ReviewRepository;
import com.makersmuse.repository.UserRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ArtworkRepository artworkRepository;
    private final UserRepository userRepository;

    @Data
    @Builder
    public static class ReviewRequest {
        private Integer rating;
        private String comment;
    }

    @Data
    @Builder
    public static class ReviewDto {
        private Long id;
        private String customerEmail;
        private Integer rating;
        private String comment;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    public static class ReviewSummary {
        private Double averageRating;
        private Long totalReviews;
        private Page<ReviewDto> reviews;
    }

    @Transactional
    public ReviewDto addReview(Long artworkId, String customerEmail, ReviewRequest req) {
        if (req.getRating() < 1 || req.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        Artwork artwork = artworkRepository.findById(artworkId)
                .orElseThrow(() -> new RuntimeException("Artwork not found"));
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (reviewRepository.existsByArtworkIdAndCustomerId(artworkId, customer.getId())) {
            throw new IllegalArgumentException("You have already reviewed this artwork");
        }

        Review review = Review.builder()
                .artwork(artwork)
                .customer(customer)
                .rating(req.getRating())
                .comment(req.getComment())
                .build();

        review = reviewRepository.save(review);
        return toDto(review);
    }

    public ReviewSummary getReviews(Long artworkId, int page, int size) {
        Page<ReviewDto> reviews = reviewRepository
                .findByArtworkIdOrderByCreatedAtDesc(artworkId, PageRequest.of(page, size, Sort.by("createdAt").descending()))
                .map(this::toDto);

        Double avg = reviewRepository.findAverageRatingByArtworkId(artworkId);
        Long count = reviewRepository.countByArtworkId(artworkId);

        return ReviewSummary.builder()
                .averageRating(avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0)
                .totalReviews(count)
                .reviews(reviews)
                .build();
    }

    private ReviewDto toDto(Review r) {
        return ReviewDto.builder()
                .id(r.getId())
                .customerEmail(r.getCustomer().getEmail().split("@")[0] + "@***")
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
