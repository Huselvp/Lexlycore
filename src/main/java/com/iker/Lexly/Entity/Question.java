package com.iker.Lexly.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.iker.Lexly.DTO.ChoiceRelatedTextePairDTO;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "question")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    @Column(name = "question_text")
    private String questionText;
    @Column(name="Description")
    private String Description;
    @Column(name="Description-Details")
    private String DescriptionDetails;
    @Column(name= "value_type")
    private String valueType;
    @Column(name= "text_erea")
    private String Texte;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "question")
    private List<ChoiceRelatedTextePair> choices;
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DocumentQuestionValue> documentQuestionValues = new ArrayList<>();

    @ManyToOne
   @JsonIgnore
    @JsonManagedReference
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
    public String getDescription(){return  Description;}
    public String getDescriptionDetails(){return DescriptionDetails;}
    public void setDescription(String Description){this.Description=Description;}
    public void setDescriptionDetails(String DescriptionDetails){this.DescriptionDetails=DescriptionDetails;}
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
    public List<DocumentQuestionValue> getDocumentQuestionValues() {
        return documentQuestionValues;
    }

    public void setDocumentQuestionValues(List<DocumentQuestionValue> documentQuestionValues) {
        this.documentQuestionValues = documentQuestionValues;
    }
    public List<ChoiceRelatedTextePair> getChoices() {
        return choices;
    }

    public void setChoices(List<ChoiceRelatedTextePair> choices) {
        this.choices = choices;
    }
}