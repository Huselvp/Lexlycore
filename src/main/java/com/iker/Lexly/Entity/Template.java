package com.iker.Lexly.Entity;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

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
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    private Category category;
    public Template(String name, Category category, String templateDescription,float cost) {
        this.templateName = name;
        this.templateDescription=templateDescription;
        this.cost=cost;
        this.category = category;
    }
    @OneToMany(mappedBy = "template")
    private List<Question> questions = new ArrayList<>();

    @OneToMany(mappedBy = "template")
    private List<Documents> documents = new ArrayList<>();


    public Template() {
    }
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public void setTemplateDescription(String templateDescription) {
        this.templateDescription = templateDescription;
    }
    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public List<Documents> getDocuments() {
        return documents;
    }

    public void setDocuments(List<Documents> documents) {
        this.documents = documents;
    }
}