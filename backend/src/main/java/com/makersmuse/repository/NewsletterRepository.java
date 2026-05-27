package com.makersmuse.repository;

import com.makersmuse.entity.NewsletterSubscriber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NewsletterRepository extends JpaRepository<NewsletterSubscriber, Long> {
    boolean existsByEmail(String email);
}
