package com.iker.Lexly.DTO;

public class DocumentQuestionValueDTO {
    private Long documentQuestionValueId;
    private Long documentId;
    private Long questionId;
    private String value;

    public Long getDocumentQuestionValueId() {
        return documentQuestionValueId;
    }

    public void setDocumentQuestionValueId(Long documentQuestionValueId) {
        this.documentQuestionValueId = documentQuestionValueId;
    }

    public Long getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}