package com.iker.Lexly.request;

import java.time.LocalDateTime;

public class DocumentCreateRequest {
    private Long userId;
    private Long templateId;
    private LocalDateTime createdAt;
    private boolean isDraft;
    public Integer getUserId() {
        return Math.toIntExact(userId);
    }

    // Setter for userId
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    // Getter for templateId
    public Long getTemplateId() {
        return templateId;
    }

    // Setter for templateId
    public void setTemplateId(Long templateId) {
        this.templateId = templateId;
    }

    // Other getters and setters for additional properties

    // Getter and setter for createdAt
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isDraft() {
        return isDraft;
    }

    public void setDraft(boolean draft) {
        isDraft = draft;
    }
}

