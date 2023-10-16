package com.iker.Lexly.Entity;

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
    private boolean isDraft;
    @ManyToOne
    private User user;
    @ManyToOne
    private Template template;
    @OneToMany(mappedBy = "document")
    private List<TemplateQuestionValue> documentQuestionValues;
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public List<TemplateQuestionValue> getTemplateQuestionValues() {
        return documentQuestionValues;
    }

    public void setTemplateQuestionValues(List<TemplateQuestionValue> templateQuestionValues) {
        this.documentQuestionValues = templateQuestionValues;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public boolean getDraft(){
        return isDraft;
    }
    public void setDraft(boolean draft){
        this.isDraft=draft;
    }

}
