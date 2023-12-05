package com.iker.Lexly.Paiement;

import com.iker.Lexly.Entity.Documents;
import com.iker.Lexly.Entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
@Table(name = "\"order\"")
public class Order {
    private double price;
    private String currency;
    private String method;
    private String intent;
    private String description;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String token;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    @ManyToOne
    @JoinColumn(name = "document_id")
    private Documents document;
    public Order(double price, String currency, String method, String intent, String description, User user, Documents document) {
        this.price = price;
        this.currency = currency;
        this.method = method;
        this.intent = intent;
        this.description = description;
        this.user = user;
        this.document = document;
    }
    public Documents getDocument() {
        return document;
    }

    public void setDocument(Documents document) {
        this.document = document;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setApprovalUrl(String href) {
        // Implement the logic if needed
    }

    // Add a method to get paymentStatus from Documents
    public boolean getPaymentStatus() {
        return document != null && document.isPaymentStatus();
    }
}
