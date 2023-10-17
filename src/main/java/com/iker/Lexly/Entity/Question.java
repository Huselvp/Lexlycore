package com.iker.Lexly.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "question")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    @Column(name = "question_text")
    private String questionText;
    @ManyToMany(mappedBy = "questions")
    private Set<Template> templates = new HashSet<>();
    @ManyToOne
    private Template template;
    @OneToMany(mappedBy = "question")
    @JsonIgnoreProperties("question")
    private Set<TemplateQuestionValue> templateQuestionValues = new HashSet<>();
    public Long getId() {
        return id;
    }
    public boolean isNew() {
        return id == null || id == 0;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Set<Template> getTemplates() {
        return templates;
    }
    public void setTemplates(Set<Template> templates) {
        this.templates = templates;
    }
    public String getQuestionText() {
        return questionText;
    }
    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }
    public Set<TemplateQuestionValue> getTemplateQuestionValues() {
        return templateQuestionValues;
    }
    public void setTemplateQuestionValues(Set<TemplateQuestionValue> templateQuestionValues) {
        this.templateQuestionValues = templateQuestionValues;
    }
    public Template getTemplate() {
        return template;
    }

    public void setTemplate(Template template) {
        this.template = template;
    }
}