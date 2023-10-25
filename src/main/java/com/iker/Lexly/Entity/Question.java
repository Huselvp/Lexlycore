package com.iker.Lexly.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "question")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    @Column(name = "question_text")
    private String questionText;
    @Column(name= "value_type")
    private String valueType;
    @Column(name= "text_erea")
    private String Texte;
    @ManyToOne
    private Template template;
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public Template getTemplates() {
        return template;
    }
    public String getValueType(){return valueType;}
    public void setValueType(String valueType){this.valueType=valueType;}
    public String  getTexte(){ return Texte;}
    public String setTexte(String texte){return this.Texte=texte;}
    public String getQuestionText() {
        return questionText;
    }
    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }
    public Template getTemplate() {
        return template;
    }
    public void setTemplate(Template template) {
        this.template = template;
    }
}