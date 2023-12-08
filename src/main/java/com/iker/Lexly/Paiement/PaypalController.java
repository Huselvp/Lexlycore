package com.iker.Lexly.Paiement;

import com.iker.Lexly.Entity.Documents;
import com.iker.Lexly.Entity.Template;
import com.iker.Lexly.Entity.User;
import com.iker.Lexly.repository.DocumentsRepository;
import com.iker.Lexly.service.DocumentsService;
import com.iker.Lexly.service.OrderService;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import jakarta.ws.rs.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment/")
public class PaypalController {
    @Autowired
    PaypalService paypalService;
    @Autowired
    DocumentsRepository documentsRepository;
    @Autowired
    DocumentsService documentsService;
    @Autowired
    OrderService orderService;
    @PostMapping("initiate-payment/{documentId}")
    public ResponseEntity<String> initiatePayment(@PathVariable Long documentId) {
        try {
            Documents document = documentsRepository.findById(documentId)
                    .orElseThrow(() -> new NotFoundException("Document not found"));

            Template template = document.getTemplate();
            User user = document.getUser();
            float totalCost = template.getCost();
            Order order = new Order(totalCost, "USD", "paypal", "sale", "Document Payment", user, document);

            orderService.saveOrder(order);
            String approvalUrl = paypalService.processPayment(order);
            return ResponseEntity.ok(approvalUrl);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to initiate payment process");
        }
    }
    @PostMapping("process")
    public ResponseEntity<String> processPayment(@RequestBody Order order) {
        try {
            Payment payment = paypalService.createPayment(
                    order.getPrice(), order.getCurrency(), order.getMethod(),
                    order.getIntent(), order.getDescription(),
                    "http://localhost:8080/api/payments/cancel",
                    "http://localhost:8080/api/payments/success"
            );
            for (Links link : payment.getLinks()) {
                if (link.getRel().equals("approval_url")) {
                    return ResponseEntity.ok(link.getHref());
                }
            }
        } catch (PayPalRESTException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to initiate payment process");
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to initiate payment process");
    }
    @GetMapping("/cancel")
    public ResponseEntity<String> cancelPay() {
        return ResponseEntity.ok("Payment canceled");
    }

    @GetMapping("success")
        public ResponseEntity<String> successPay(@RequestParam("token") String token, @RequestParam("PayerID") String payerId) {
            Order order = orderService.findByToken(token);

            try {
                Payment payment = paypalService.executePayment(token, payerId);
                if ("approved".equals(payment.getState())) {
                    Documents document = documentsService.updatePaymentStatus(order.getDocument().getId());
                    return ResponseEntity.ok("Payment successful. Document generated and available for download.");
                }
            } catch (PayPalRESTException e) {
                e.printStackTrace();
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Payment not approved");
        }
}
