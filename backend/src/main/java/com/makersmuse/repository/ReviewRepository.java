package com.makersmuse.repository;

import com.makersmuse.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByArtworkIdOrderByCreatedAtDesc(Long artworkId, Pageable pageable);
    Optional<Review> findByArtworkIdAndCustomerId(Long artworkId, Long customerId);
    boolean existsByArtworkIdAndCustomerId(Long artworkId, Long customerId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.artwork.id = :artworkId")
    Double findAverageRatingByArtworkId(@Param("artworkId") Long artworkId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.artwork.id = :artworkId")
    Long countByArtworkId(@Param("artworkId") Long artworkId);
}
