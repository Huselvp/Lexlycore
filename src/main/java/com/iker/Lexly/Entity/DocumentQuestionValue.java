package com.iker.Lexly.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;



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
    @JsonIgnore
    private Documents document;

    @Column(length = 100000)
    private String value;
    private LocalTime firstTimeValue;
    private LocalTime secondTimeValue;
    private LocalDate dateValue;
    private Integer intFilterValue;
    private double doubleFilterValue;


    public DocumentQuestionValue(Question question, Documents document, Object filterValue) {
        this.question = question;
        this.document = document;
        if (filterValue instanceof Integer) {
            this.intFilterValue = (Integer) filterValue;
        } else if (filterValue instanceof Double) {
            this.doubleFilterValue = (Double) filterValue;
        }
    }

    public DocumentQuestionValue(Question question, Documents document, String value) {
        this.question = question;
        this.document = document;
        this.value = value;

    }
    public DocumentQuestionValue(Question question, Documents document,LocalTime firstTimeValue,LocalTime secondTimeValue) {
        this.question = question;
        this.document = document;
        this.firstTimeValue=firstTimeValue;
        this.secondTimeValue=secondTimeValue;

    }

    public DocumentQuestionValue(Question question, Documents document,LocalDate dateValue) {
        this.question = question;
        this.document = document;
        this.dateValue= dateValue;

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

    public LocalTime getSecondTimeValue() {
        return secondTimeValue;
    }

    public void setSecondTimeValue(LocalTime secondTimeValue) {
        this.secondTimeValue = secondTimeValue;
    }

    public LocalDate getDateValue() {
        return dateValue;
    }

    public void setDateValue(LocalDate dateValue) {
        this.dateValue = dateValue;
    }

    public LocalTime getFirstTimeValues() {
        return firstTimeValue;
    }

    public void setFirstTimeValues(LocalTime firstTimeValue) {
        this.firstTimeValue = firstTimeValue;
    }

    public int getIntFilterValue() {
        return intFilterValue;
    }

    public void setIntFilterValue(int intFilterValue) {
        this.intFilterValue = intFilterValue;
    }

    public double getDoubleFilterValue() {
        return doubleFilterValue;
    }

    public void setDoubleFilterValue(double doubleFilterValue) {
        this.doubleFilterValue = doubleFilterValue;
    }
}
