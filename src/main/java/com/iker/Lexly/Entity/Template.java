package com.iker.Lexly.Entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@Entity
@Builder
@AllArgsConstructor
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
    @JoinColumn(name = "category_id")
    private Subcategory subcategory;

    public Template(List<Question> questions,String name,Subcategory subcategory, String templateDescription,float cost) {
        this.templateName = name;
        this.templateDescription=templateDescription;
        this.cost=cost;
       this.subcategory=subcategory;
        this.questions=questions;
    }
    @OneToMany(mappedBy = "template", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions = new ArrayList<>();
    @OneToMany(mappedBy = "template", cascade = CascadeType.ALL,  orphanRemoval = true)
    @JsonIgnore
    private List<Documents> documents = new ArrayList<>();
    public Template() {
    }
    public boolean isNew() {
        return id == null || id == 0;
    }
}