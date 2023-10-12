package com.iker.Lexly.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "category")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column
    @NotNull
    private String category;
    public String getCategory(){return category;}
    public void setCategory(String category){this.category=category;}
    public Long getId(){return id;}
    public void setId(Long id){this.id=id;}

}
