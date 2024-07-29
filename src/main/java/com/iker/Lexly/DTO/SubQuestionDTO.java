package com.iker.Lexly.DTO;

import com.iker.Lexly.Entity.Filter;
import lombok.Getter;

import java.util.List;

@Getter
public class SubQuestionDTO {
    private Long id;
    private String questionText;
    private String description;
    private String descriptionDetails;
    private String valueType;
    private String textArea;
    private FormDTO form;
    private Filter filter;
    private List<SubQuestionDTO> subQuestions;

    public void setForm(FormDTO form) {
        this.form = form;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDescriptionDetails(String descriptionDetails) {
        this.descriptionDetails = descriptionDetails;
    }

    public void setValueType(String valueType) {
        this.valueType = valueType;
    }

    public void setTextArea(String textArea) {
        this.textArea = textArea;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setFilter(Filter filter) {
        this.filter = filter;
    }

    public List<SubQuestionDTO> getSubQuestions() {
        return subQuestions;
    }

    public void setSubQuestions(List<SubQuestionDTO> subQuestions) {
        this.subQuestions = subQuestions;
    }
}