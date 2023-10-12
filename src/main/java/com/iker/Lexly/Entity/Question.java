package com.iker.Lexly.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.List;
@Entity
@Table(name = "question")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "question_text")
    private String questionText;  // Add this attribute

    @OneToMany(mappedBy = "question")
    private List<TemplateQuestionValue> templateQuestionValue;

    public Long getId() {
        return id;
    }
    public boolean isNew() {
        return id == null || id == 0;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public List<TemplateQuestionValue> getTemplateQuestionValue() {
        return templateQuestionValue;
    }

    public void setTemplateQuestionValue(List<TemplateQuestionValue> templateQuestionValue) {
        this.templateQuestionValue = templateQuestionValue;
    }
    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;  // Add this setter
    }
}
