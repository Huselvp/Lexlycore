package com.iker.Lexly.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "document")
public class Documents {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "is_draft")
    private boolean isDraft=true;
    @Column(name = "payment_status")
    private Boolean paymentStatus=false;
    @ManyToOne
    private User user;
    @ManyToOne
    private Template template;
    @OneToMany(mappedBy = "document", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private List<DocumentQuestionValue> documentQuestionValues;
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
    public Template getTemplate() {
        return template;
    }
    public void setTemplate(Template template) {
        this.template = template;
    }
    public List<DocumentQuestionValue> getDocumentQuestionValues() {
        return documentQuestionValues;
    }
    public void setDocumentQuestionValues(List<DocumentQuestionValue> documentQuestionValues) {
        this.documentQuestionValues = documentQuestionValues;
    }
    public boolean getDraft(){
        return isDraft;
    }
    public void setDraft(boolean draft){
        this.isDraft=draft;
    }
    public boolean isPaymentStatus() {
        return paymentStatus;
    }
    public void setPaymentStatus(boolean paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
}
