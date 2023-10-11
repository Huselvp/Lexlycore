package com.iker.Lexly.Entity;

import jakarta.persistence.*;
import java.util.List;
@Entity
@Table(name = "question")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Transient
    @Column(name = "question_text")
    private String questionText;
    @OneToMany(mappedBy = "question")
    private List<TemplateQuestionValue> templateQuestionValue;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

}
