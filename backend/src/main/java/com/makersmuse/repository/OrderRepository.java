package com.makersmuse.repository;

import com.makersmuse.entity.Order;
import com.makersmuse.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByCustomerIdOrderByCreatedAtDesc(Long customerId, Pageable pageable);
    Optional<Order> findByStripeSessionId(String sessionId);
    boolean existsByStripeSessionIdAndPaymentStatus(String sessionId, PaymentStatus status);
}
