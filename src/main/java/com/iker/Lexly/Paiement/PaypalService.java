package com.iker.Lexly.Paiement;

import com.iker.Lexly.Entity.Documents;
import com.iker.Lexly.Entity.Template;
import com.iker.Lexly.repository.DocumentsRepository;
import com.iker.Lexly.repository.TemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.*;

@Service
public class PaypalService {
    @Value("${paypal.client.id}")
    private String clientId;

    @Value("${paypal.client.secret}")
    private String clientSecret;

    @Value("${paypal.base.url}")
    private String baseUrl;

    @Autowired

    private TemplateRepository templateRepository;
   @Autowired

    private final DocumentsRepository documentsRepository;
   @Autowired

    private RestTemplate restTemplate;

    public PaypalService(DocumentsRepository documentsRepository) {
        this.documentsRepository = documentsRepository;
    }

    public String generateAccessToken() {
        try {
            if (clientId == null || clientSecret == null) {
                throw new RuntimeException("MISSING_API_CREDENTIALS");
            }
            String auth = Base64.getEncoder().encodeToString((clientId + ":" + clientSecret).getBytes());
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Basic " + auth);
            UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(baseUrl + "/v1/oauth2/token")
                    .queryParam("grant_type", "client_credentials");
            ResponseEntity<Map> response = restTemplate.postForEntity(uriBuilder.toUriString(), new HttpEntity<>(headers), Map.class);
            String accessToken = (String) Objects.requireNonNull(response.getBody()).get("access_token");

            return accessToken;
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Access Token");
        }
    }

    public String createOrder(Long templateId) {
        try {
            Template template = templateRepository.findById(templateId)
                    .orElseThrow(() -> new RuntimeException("Template not found"));

            String accessToken = generateAccessToken();
            String url = baseUrl + "/v2/checkout/orders";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + accessToken);

            Map<String, Object> payload = new HashMap<>();
            payload.put("intent", "CAPTURE");

            Map<String, Object> purchaseUnits = new HashMap<>();
            Map<String, Object> amount = new HashMap<>();
            amount.put("currency_code", "USD");
            amount.put("value", String.valueOf(template.getCost()));
            purchaseUnits.put("amount", amount);

            List<Map<String, Object>> purchaseUnitsList = Collections.singletonList(purchaseUnits);
            payload.put("purchase_units", purchaseUnitsList);

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payload, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);
            return (String) Objects.requireNonNull(response.getBody()).get("id");
        } catch (Exception e) {
            throw new RuntimeException("Failed to create order");
        }
    }

    public void captureOrder(String orderId, Long documentId) {
        try {
            String accessToken = generateAccessToken();
            String url = baseUrl + "/v2/checkout/orders/" + orderId + "/capture";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + accessToken);
            Map<String, Object> requestBody = new HashMap<>();
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);
            Map<String, Object> responseData = response.getBody();
            boolean paymentCompleted = "COMPLETED".equals(responseData.get("status"));
            Documents document = documentsRepository.findById(documentId)
                    .orElseThrow(() -> new RuntimeException("Document not found"));

            document.setPaymentStatus(paymentCompleted);
            documentsRepository.save(document);

        } catch (Exception e) {
            throw new RuntimeException("Failed to capture order");
        }
    }
}
