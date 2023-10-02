package com.iker.Lexly.Entity;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "templates")
public class Template {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "template_id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;


    public Template(String name,String content) {
        this.name=name;
        this.content=content;

    }

    public Template() {

    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Template template = (Template) o;
        return Objects.equals(id, template.id) && Objects.equals(name, template.name);
    }
    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }
}
