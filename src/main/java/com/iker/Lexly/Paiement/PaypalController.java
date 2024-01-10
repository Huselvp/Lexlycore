package com.iker.Lexly.Paiement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/paypal")
public class PaypalController {
    @Autowired
    private PaypalService paypalService;

    @PostMapping("/create-order/{templateId}")
    public ResponseEntity<String> createOrder(@PathVariable Long templateId) {
        try {
            String orderId = paypalService.createOrder(templateId);
            return ResponseEntity.ok(orderId);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating PayPal order: " + e.getMessage());
        }
    }

    @PostMapping("/orders/{orderId}/capture")
    public ResponseEntity<Map<String, Object>> captureOrder(
            @PathVariable String orderId,
            @RequestParam Long documentId) {
        try {
            paypalService.captureOrder(orderId, documentId);
            return ResponseEntity.ok(Collections.singletonMap("status", "success"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Collections.singletonMap("error", "Failed to capture order."));
        }
    }
}
