package com.iker.Lexly.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sub_question")
public class SubQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "question_text")
    private String questionText;

    @Column(name = "description")
    @JsonProperty("Description")
    private String description;

    @Column(name = "description_details")
    @JsonProperty("description_details")
    private String descriptionDetails;

    @Column(name = "value_type")
    @NotNull
    private String valueType;

    @Column(name = "text_area")
    @JsonProperty("text_area")
    private String textArea;

    @Column(name = "position")
    private int position;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "parent_question_id")
    private Question parentQuestion;

    @ManyToOne
    @JoinColumn(name = "parent_sub_question_id")
    @JsonBackReference
    private SubQuestion parentSubQuestion;

    @OneToMany(mappedBy = "parentSubQuestion", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SubQuestion> subQuestions = new ArrayList<>();

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

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public Question getParentQuestion() {
        return parentQuestion;
    }

    public void setParentQuestion(Question parentQuestion) {
        this.parentQuestion = parentQuestion;
    }

    public SubQuestion getParentSubQuestion() {
        return parentSubQuestion;
    }

    public void setParentSubQuestion(SubQuestion parentSubQuestion) {
        this.parentSubQuestion = parentSubQuestion;
    }

    public List<SubQuestion> getSubQuestions() {
        return subQuestions;
    }

    public void setSubQuestions(List<SubQuestion> subQuestions) {
        this.subQuestions = subQuestions;
    }

    public void addSubQuestion(SubQuestion subQuestion) {
        subQuestions.add(subQuestion);
        subQuestion.setParentSubQuestion(this);
    }

    public void removeSubQuestion(SubQuestion subQuestion) {
        subQuestions.remove(subQuestion);
        subQuestion.setParentSubQuestion(null);
    }
}
