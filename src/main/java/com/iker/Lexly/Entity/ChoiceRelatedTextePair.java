package com.iker.Lexly.Entity;

import jakarta.persistence.*;

@Embeddable
public class ChoiceRelatedTextePair {
    private String choice;
    private String relatedTexte;

    public ChoiceRelatedTextePair() {
        // Default constructor
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
}