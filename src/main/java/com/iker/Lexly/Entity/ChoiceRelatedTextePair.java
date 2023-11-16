package com.iker.Lexly.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonAppend;
import jakarta.persistence.*;
@Entity
@Table(name = "choices_related_texte_pairs")

public class ChoiceRelatedTextePair {
    private String choice;
    private String relatedTexte;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(cascade = CascadeType.REMOVE)
    @JsonIgnore
    @JoinColumn(name = "question_id")
    private Question question;
    public ChoiceRelatedTextePair() {
    }
    public ChoiceRelatedTextePair(String choice, String relatedTexte) {
        this.choice = choice;
        this.relatedTexte = relatedTexte;
    }
    public String getChoice() {
        return choice;
    }

    public void setChoice(String choice) {
        this.choice = choice;
    }

    public String getRelatedTexte() {
        return relatedTexte;
    }

    public void setRelatedTexte(String relatedTexte) {
        this.relatedTexte = relatedTexte;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public Long getId() {
        return id;
    }
}