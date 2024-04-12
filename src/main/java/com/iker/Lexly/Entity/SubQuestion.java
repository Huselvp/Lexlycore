package com.iker.Lexly.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "sub_question")
public class SubQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "question_text")
    private String questionText;

    @Column(name="description")
    @JsonProperty("Description")
    private String description;

    @Column(name="description_details")
    @JsonProperty("description_details")
    private String descriptionDetails;

    @Column(name= "value_type")
    @NotNull
    private String valueType;

    @Column(name= "text_area")
    @JsonProperty("text_area")
    private String textArea;

    @ManyToOne
    @JoinColumn(name = "parent_question_id")
    @JsonIgnore
    private Question parentQuestion;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Question getParentQuestion() {
        return parentQuestion;
    }

    public void setParentQuestion(Question parentQuestion) {
        this.parentQuestion = parentQuestion;
    }

}
