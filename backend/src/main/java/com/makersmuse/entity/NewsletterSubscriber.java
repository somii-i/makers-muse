package com.makersmuse.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "newsletter_subscribers",
        uniqueConstraints = @UniqueConstraint(columnNames = "email"))
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class NewsletterSubscriber {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime subscribedAt;
}
