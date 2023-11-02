package com.iker.Lexly.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.List;

@Entity
@Table(name = "category")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column
    @NotNull
    private String category;
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Template> templates;
    public String getCategory(){return category;}
    public void setCategory(String category){this.category=category;}
    public Long getId(){return id;}
    public void setId(Long id){this.id=id;}
    public List<Template> getTemplates() {
        return templates;
    }

}