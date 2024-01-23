package com.iker.Lexly.service;

import com.iker.Lexly.Entity.Checkout;
import com.iker.Lexly.Entity.Item;
import com.iker.Lexly.Entity.Order;
import com.iker.Lexly.Entity.Template;
import com.iker.Lexly.repository.TemplateRepository;
import com.iker.Lexly.request.PaymentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

@Service
public class PaymentService {
    private static final String SECRET_KEY = "test-secret-key-3783402397d14a1696bf0c8beaf259ce";
    private static final String PAYMENT_API_URL = "https://test.api.dibspayment.eu/v1/payments";

    private final RestTemplate restTemplate;
    private final TemplateRepository templateRepository;

    @Autowired
    public PaymentService(RestTemplate restTemplate, TemplateRepository templateRepository) {
        this.restTemplate = restTemplate;
        this.templateRepository = templateRepository;
    }


    public String initiatePayment(String templateId) {
        try {

            Template template = templateRepository.findById(Long.parseLong(templateId))
                    .orElseThrow(() -> new RuntimeException("Template not found for id: " + templateId));
            PaymentRequest paymentRequest = new PaymentRequest();
            Checkout checkout = new Checkout();
            checkout.setIntegrationType("EmbeddedCheckout");
            checkout.setUrl("http://localhost:3000/pay");
            checkout.setTermsUrl("http://localhost:8000/terms");
            checkout.setCountryCode("DNK");

            Order order = new Order();
            Item item = new Item();
            item.setReference("Template #" + template.getId());
            item.setName(template.getTemplateName());
            item.setQuantity(1);
            item.setUnit("pcs");
            item.setUnitPrice((int) template.getCost());
            item.setGrossTotalAmount((int) template.getCost());
            item.setNetTotalAmount((int) template.getCost());
            order.setItems(Collections.singletonList(item));
            order.setAmount((int) template.getCost());
            order.setCurrency("DKK");
            order.setReference("Template #" + template.getId());
            paymentRequest.setCheckout(checkout);
            paymentRequest.setOrder(order);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", SECRET_KEY);
            HttpEntity<PaymentRequest> requestEntity = new HttpEntity<>(paymentRequest, headers);
            ResponseEntity<String> responseEntity = restTemplate.postForEntity(
                    PAYMENT_API_URL,
                    requestEntity,
                    String.class
            );

            if (responseEntity.getStatusCode() == HttpStatus.OK) {
                return responseEntity.getBody();
            } else {
                throw new RuntimeException("Payment initiation failed");
            }
        } catch (Exception e) {
            throw new RuntimeException("Payment initiation failed", e);
        }
    }
}
