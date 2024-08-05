package com.iker.Lexly.Entity;
import com.fasterxml.jackson.annotation.JsonBackReference;
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


    @Column(name="description_details",length = 10000)
    @JsonProperty("description_details")
    private String DescriptionDetails;

    @Column(name= "value_type")
    @NotNull
    private String valueType;

    @Column(length = 1000000000, name= "text_area")
//    @JsonProperty("text_area")
    private String texte;

    private int position;


    @ElementCollection
    @CollectionTable(name = "list", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "option")
    private List<String> list = new ArrayList<>();


    @OneToMany(mappedBy = "parentQuestion", cascade = CascadeType.ALL)
    @JsonManagedReference("question-parent")
    private List<SubQuestion> subQuestions = new ArrayList<>();



//    @Column(name = "subquestion_order")
//    @Convert(converter = StringListConverter.class)
//    private List<Long> subquestionOrder;

    @OneToMany(mappedBy = "question", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private List<DocumentQuestionValue> documentQuestionValues = new ArrayList<>();

    @ManyToOne
    @JsonBackReference
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
        return texte;
    }

    public void setTexte(String texte) {
        this.texte = texte;
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

//    public List<Long> getSubquestionOrder() {
//        return subquestionOrder;
//    }

//    public void setSubquestionOrder(List<Long> subquestionOrder) {
//        this.subquestionOrder = subquestionOrder;
//    }
    public int getPosition() {return position;}

    public void setPosition(int position) {this.position = position;}
    public List<SubQuestion> getSubQuestions() {
        return subQuestions;
    }

    public void setSubQuestions(List<SubQuestion> subQuestions) {
        this.subQuestions = subQuestions;
    }

    public List<String> getList() {return list;}

    public void setList(List<String> list) {this.list = list;}
}
