package com.iker.Lexly.request;

public class UpdateValueRequest {
    private Long documentId;
    private Long questionId;
    private int selectedChoiceId;
    private String value;

    public Long getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
    }

    public Long getQuestionId() {
        return questionId;
    }
    public int getSelectedChoiceId() {
        return selectedChoiceId;
    }

    public void setSelectedChoiceId(int selectedChoiceId) {
        this.selectedChoiceId = selectedChoiceId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String newValue) {
        this.value = newValue;
    }
}
