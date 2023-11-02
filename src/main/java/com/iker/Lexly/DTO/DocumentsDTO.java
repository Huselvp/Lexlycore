package com.iker.Lexly.DTO;

import java.time.LocalDateTime;

public class DocumentsDTO {
    private Long id;
    private LocalDateTime createdAt;
    private boolean isDraft;



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
    public boolean isDraft() {
        return isDraft;
    }

    public void setDraft(boolean draft) {
        isDraft = draft;
    }

}
