package com.iker.Lexly.responses;

public class ApiResponseDocuments {
    private String message;
    private Long documentId;

    public ApiResponseDocuments(String message, Long documentId) {
        this.message = message;
        this.documentId = documentId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
    }
}
