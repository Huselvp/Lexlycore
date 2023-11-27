package com.iker.Lexly.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
    private boolean isDraft;

    @ManyToOne
    private User user;

    @ManyToOne
    private Template template;

    @OneToMany(mappedBy = "document")
    @JsonIgnore
    private List<DocumentQuestionValue> documentQuestionValues;

    // Constructors, other fields...

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


}
