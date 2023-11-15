package com.iker.Lexly.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
public class ChoiceRelatedTextePairDTO {
    private String choice;
    private String relatedTexte;

    public ChoiceRelatedTextePairDTO(String choice, String relatedTexte) {
        this.choice = choice;
        this.relatedTexte = relatedTexte;
    }

    public ChoiceRelatedTextePairDTO() {

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


