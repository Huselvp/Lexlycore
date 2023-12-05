package com.iker.Lexly.service;
import javax.ws.rs.NotFoundException;

import com.iker.Lexly.Entity.User;
import com.iker.Lexly.Paiement.Order;
import com.iker.Lexly.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    public void saveOrder(Order order) {
        orderRepository.save(order);
    }

    // Assuming Order is the correct return type
    public Order findByPaymentId(String paymentId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof User) {
            User currentUser = (User) authentication.getPrincipal();
            return orderRepository.findByDocument_PaymentStatus(true)
                    .orElseThrow(() -> new NotFoundException("Order not found for paymentId: " + paymentId));
        } else {
            throw new RuntimeException("User not authenticated");
        }
    }

    public Order findByToken(String token) {
        return orderRepository.findByToken(token)
                .orElseThrow(() -> new NotFoundException("Order not found for token: " + token));
    }
}

