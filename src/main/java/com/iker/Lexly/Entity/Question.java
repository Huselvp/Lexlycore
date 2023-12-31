package com.iker.Lexly.Entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
@Entity
@Table(name = "question")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "question_text")
    private String questionText;

    @Column(name="description")
    @JsonProperty("Description")
    private String Description;

    @Column(name="description_details")
    @JsonProperty("description_details")
    private String DescriptionDetails;

    @Column(name= "value_type")
    @NotNull
    private String valueType;

    @Column(name= "text_area")
    @JsonProperty("text_area")
    private String Texte;

    @OneToMany(mappedBy = "question", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private List<DocumentQuestionValue> documentQuestionValues = new ArrayList<>();

    @ManyToOne
    @JsonManagedReference
    @JsonIgnore
    private Template template;


    public Long getId() {
        return id;
    }

    public void setId(Long questionid) {
        this.id = questionid;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getDescription() {
        return Description;
    }

    public void setDescription(String Description) {
        this.Description = Description;
    }

    public String getDescriptionDetails() {
        return DescriptionDetails;
    }

    public void setDescriptionDetails(String DescriptionDetails) {
        this.DescriptionDetails = DescriptionDetails;
    }

    public String getValueType() {
        return valueType;
    }

    public void setValueType(String valueType) {
        this.valueType = valueType;
    }

    public String getTexte() {
        return Texte;
    }

    public void setTexte(String texte) {
        this.Texte = texte;
    }

    public List<DocumentQuestionValue> getDocumentQuestionValues() {
        return documentQuestionValues;
    }

    public void setDocumentQuestionValues(List<DocumentQuestionValue> documentQuestionValues) {
        this.documentQuestionValues = documentQuestionValues;
    }

    public Template getTemplate() {
        return template;
    }

    public void setTemplate(Template template) {
        this.template = template;
    }
}
