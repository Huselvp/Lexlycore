package com.iker.Lexly.DTO;

public class SubQuestionDTO {
    private String questionText;
    private String description;
    private String descriptionDetails;
    private String valueType;
    private String textArea;

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public String getDescriptionDetails() {
        return descriptionDetails;
    }

    public void setDescriptionDetails(String descriptionDetails) {
        this.descriptionDetails = descriptionDetails;
    }

    public String getValueType() {
        return valueType;
    }
    public void setValueType(String valueType) {
        this.valueType = valueType;
    }

    public String getTextArea() {
        return textArea;
    }

    public void setTextArea(String textArea) {
        this.textArea = textArea;
    }
}