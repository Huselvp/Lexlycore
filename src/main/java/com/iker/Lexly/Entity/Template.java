package com.iker.Lexly.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "template")
public class Template {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "template_name")
    private String templateName;
    @Column(name = "template_description")
    private String templateDescription;
    @Column(name = "template_cost")
    private float cost;

    @ManyToMany(mappedBy = "templates")
    private Set<User> users = new HashSet<>();
    @ManyToOne
    private Category category;
    public Template(String name, Category category, String templateDescription,float cost) {
        this.templateName = name;
        this.templateDescription=templateDescription;
        this.cost=cost;
        this.category = category;
    }
    @ManyToMany
    @JoinTable(name = "template_question",
            joinColumns = @JoinColumn(name = "template_id"),
            inverseJoinColumns = @JoinColumn(name = "question_id"))
    private Set<Question> questions = new HashSet<>();

    @OneToMany(mappedBy = "template")
    private List<TemplateQuestionValue> templateQuestionValues;


    public Template() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getTemplateName() {
        return templateName;
    }

    public float getCost() {
        return cost;
    }
    public boolean isNew() {
        return id == null || id == 0;
    }
    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }

    public void setCost(float Cost) {
        this.cost = Cost;
    }

    public String getTemplateDescription() {
        return templateDescription;
    }
    public Set<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(Set<Question> questions) {
        this.questions = questions;
    }
    public void setTemplateDescription(String templateDescription) {
        this.templateDescription = templateDescription;
    }
    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
    public List<TemplateQuestionValue> getTemplateQuestionValues() {
        return templateQuestionValues;
    }

    public void setTemplateQuestionValues(List<TemplateQuestionValue> templateQuestionValues) {
        this.templateQuestionValues = templateQuestionValues;
    }


}