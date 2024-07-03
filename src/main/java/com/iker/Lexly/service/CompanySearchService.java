package com.iker.Lexly.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iker.Lexly.request.CompanyDetails;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;

@Service
public class CompanySearchService {

    private static final String USERNAME = "Yonas_Nielsen_CVR_I_SKYEN";
    private static final String PASSWORD = "4353c14e-2425-477d-99c8-60604470249c";
    private static final String URL = "http://distribution.virk.dk/cvr-permanent/virksomhed/_search";
    private final ObjectMapper objectMapper = new ObjectMapper();

    private ResponseEntity<String> searchCompanyByCvr(String cvr) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Basic " + Base64.getEncoder().encodeToString((USERNAME + ":" + PASSWORD).getBytes()));

        String requestBody = String.format(
                "{\"query\":{\"bool\":{\"must\":[{\"term\":{\"Vrvirksomhed.cvrNummer\":\"%s\"}}]}}}",
                cvr
        );

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.exchange(URL, HttpMethod.POST, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            return ResponseEntity.ok(response.getBody());
        } else {
            return ResponseEntity.status(response.getStatusCode()).body("Request failed with status code: " + response.getStatusCode());
        }
    }


    public ResponseEntity<CompanyDetails> getCompanyDetails(String cvr) {
        ResponseEntity<String> searchResult = searchCompanyByCvr(cvr);

        if (searchResult.getStatusCode() != HttpStatus.OK) {
            return ResponseEntity.status(searchResult.getStatusCode()).body(null);
        }

        try {
            JsonNode rootNode = objectMapper.readTree(searchResult.getBody());
            JsonNode companyInfo = rootNode.path("hits").path("hits").get(0).path("_source").path("Vrvirksomhed");

            CompanyDetails details = new CompanyDetails();
            details.setCvrNumber(companyInfo.path("cvrNummer").asText());
            details.setName(companyInfo.path("navne").get(0).path("navn").asText());

            JsonNode addressNode = companyInfo.path("beliggenhedsadresse").get(0);
            details.setAddress(addressNode.path("vejnavn").asText() + " " + addressNode.path("husnummerFra").asText());
            details.setPostalCode(addressNode.path("postnummer").asText());
            details.setCity(addressNode.path("postdistrikt").asText());

            details.setStartDate(companyInfo.path("livsforloeb").get(0).path("periode").path("gyldigFra").asText());
            details.setCompanyForm(companyInfo.path("virksomhedsform").get(0).path("langBeskrivelse").asText());
            details.setAdvertisingProtection(companyInfo.path("reklamebeskyttet").asBoolean() ? "Ja" : "Nej");
            details.setStatus(companyInfo.path("virksomhedsstatus").get(0).path("status").asText());

            return ResponseEntity.ok(details);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }
}
