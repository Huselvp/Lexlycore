package com.iker.Lexly.service;

import com.iker.Lexly.Entity.*;
import com.iker.Lexly.repository.DocumentsRepository;
import com.iker.Lexly.repository.TemplateRepository;
import com.iker.Lexly.request.ChargeRequest;
import com.iker.Lexly.request.PaymentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class PaymentService {
    private static final String SECRET_KEY = "test-secret-key-3783402397d14a1696bf0c8beaf259ce";
    private static final String PAYMENT_API_URL = "https://test.api.dibspayment.eu/v1/payments";
    private static final String CHARGE_API_URL_TEMPLATE = PAYMENT_API_URL + "/%s/charges";



    private final RestTemplate restTemplate;
    private final DocumentsRepository documentsRepository;
    private final TemplateRepository templateRepository;

    @Autowired
    public PaymentService(DocumentsRepository documentsRepository,RestTemplate restTemplate, TemplateRepository templateRepository) {
        this.restTemplate = restTemplate;
        this.documentsRepository=documentsRepository;
        this.templateRepository = templateRepository;
    }

    public String initiatePayment(String templateId) {
        try {
            // Fetch the template to get the dynamic cost
            Template template = templateRepository.findById(Long.parseLong(templateId))
                    .orElseThrow(() -> new RuntimeException("Template not found for id: " + templateId));

            // Construct the payload directly
            Map<String, Object> payload = new HashMap<>();
            payload.put("checkout", createCheckoutObject());
            payload.put("order", createOrderObject(template));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", SECRET_KEY);

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payload, headers);

            // Make the HTTP request to initiate payment
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

    private Map<String, Object> createCheckoutObject() {
        Map<String, Object> checkout = new HashMap<>();
        checkout.put("integrationType", "EmbeddedCheckout");
        checkout.put("url", "http://localhost:3000/pay");
        checkout.put("termsUrl", "http://localhost:8000/terms");
        checkout.put("countryCode", "DNK");
        return checkout;
    }

    private Map<String, Object> createOrderObject(Template template) {
        Map<String, Object> order = new HashMap<>();
        List<Map<String, Object>> items = new ArrayList<>();
        Map<String, Object> item = new HashMap<>();
        item.put("reference", "Template #" + template.getId());
        item.put("name", template.getTemplateName());
        item.put("quantity", 1);
        item.put("unit", "pcs");
        item.put("unitPrice", (int) template.getCost());
        item.put("grossTotalAmount", (int) template.getCost());
        item.put("netTotalAmount", (int) template.getCost());

        items.add(item);

        order.put("items", items);
        order.put("amount", (int) template.getCost());
        order.put("currency", "DKK");
        order.put("reference", "Template #" + template.getId());

        return order;
    }

    public String chargePayment(ChargeRequest chargeRequest) {
        try {
            String chargeApiUrl = "https://test.api.dibspayment.eu/v1/payments/" + chargeRequest.getPaymentId() + "/charges";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Idempotency-Key", generateUniqueString());
            headers.set("Authorization", SECRET_KEY);

            Template template = templateRepository.findById(Long.parseLong(chargeRequest.getTemplateId()))
                    .orElseThrow(() -> new RuntimeException("Template not found for id: " + chargeRequest.getTemplateId()));

            Map<String, Object> payload = new HashMap<>();
            payload.put("amount", (int) template.getCost());

            ResponseEntity<String> responseEntity = restTemplate.postForEntity(
                    chargeApiUrl,
                    new HttpEntity<>(payload, headers),
                    String.class
            );

            if (responseEntity.getStatusCode() == HttpStatus.OK) {
                updatePaymentStatus(chargeRequest.getDocumentId());
                return responseEntity.getBody();
            } else {
                throw new RuntimeException("Payment charging failed");
            }
        } catch (Exception e) {
            throw new RuntimeException("Payment charging failed", e);
        }
    }

    public void updatePaymentStatus(Long documentId) {
        Documents document = documentsRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found for id: " + documentId));
        document.setPaymentStatus(true);
        documentsRepository.save(document);
    }

    private String generateUniqueString() {
        return UUID.randomUUID().toString();
    }
}
