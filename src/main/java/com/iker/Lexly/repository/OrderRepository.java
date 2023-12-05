package com.iker.Lexly.repository;

import com.iker.Lexly.Entity.User;
import com.iker.Lexly.Paiement.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Repository

public interface OrderRepository extends JpaRepository<Order,Long> {
    Optional<Order> findByDocument_PaymentStatus(Boolean paymentStatus);


    Optional<Order> findByToken(String token);
}
