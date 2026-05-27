package com.makersmuse.repository;

import com.makersmuse.entity.Artwork;
import com.makersmuse.enums.ArtCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ArtworkRepository extends JpaRepository<Artwork, Long>,
        JpaSpecificationExecutor<Artwork> {

    Page<Artwork> findByArtistIdAndActiveTrue(Long artistId, Pageable pageable);



    List<Artwork> findAllByIdIn(List<Long> ids);
}
