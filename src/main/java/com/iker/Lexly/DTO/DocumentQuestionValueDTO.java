package com.iker.Lexly.DTO;

import com.iker.Lexly.Entity.Documents;
import com.iker.Lexly.Entity.Question;
import com.iker.Lexly.request.FormValues;
import com.iker.Lexly.request.FormValuesRequest;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class DocumentQuestionValueDTO {
    private Long documentQuestionValueId;
    private Long documentId;
    private Long questionId;
    private String value;
    private LocalTime firstTimeValues;
    private LocalTime secondTimeValue;
    private LocalDate dateValue;
    private Integer intFilterValue;
    private double doubleFilterValue;
    private List<FormValues> formValues;


    public List<FormValues> getFormValues() {
        return formValues;
    }

    public void setFormValues(List<FormValues> formValues) {
        this.formValues = formValues;
    }

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

    public LocalTime getFirstTimeValues() {
        return firstTimeValues;
    }

    public void setFirstTimeValues(LocalTime firstTimeValues) {
        this.firstTimeValues = firstTimeValues;
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

    public Integer getIntFilterValue() {
        return intFilterValue;
    }

    public void setIntFilterValue(Integer intFilterValue) {
        this.intFilterValue = intFilterValue;
    }

    public double getDoubleFilterValue() {
        return doubleFilterValue;
    }

    public void setDoubleFilterValue(double doubleFilterValue) {
        this.doubleFilterValue = doubleFilterValue;
    }
}