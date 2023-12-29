package com.iker.Lexly.Entity;

import jakarta.persistence.*;

@Entity
public class DocumentQuestionValue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long documentQuestionValueId;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;

    @ManyToOne
    @JoinColumn(name = "document_id")
    private Documents document;


    private String value;

    public DocumentQuestionValue(Question question, Documents document, String value) {
        this.question = question;
        this.document = document;
        this.value = value;
    }

    public DocumentQuestionValue() {

    }

    public Long getDocumentQuestionValueId() {
        return documentQuestionValueId;
    }

    public void setDocumentQuestionValueId(Long documentQuestionValueId) {
        this.documentQuestionValueId = documentQuestionValueId;
    }

    public Documents getDocument() {
        return document;
    }

    public void setDocument(Documents document) {
        this.document = document;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }


}
