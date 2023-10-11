package com.iker.Lexly.Entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "template")
public class Template {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "template_name")
    private String templateName;
    @Column(name="category")
    private String category;

    @Column(name = "template_description")
    private String templateDescription;
    @Column(name = "template_cost")
    private float cost;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public String getCategory(){return category;}
    public void setCategory(String category){this.category=category;}

    public String getTemplateName() {
        return templateName;
    }

    public float getCost() {
        return cost;
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

}
