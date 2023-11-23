package com.iker.Lexly.DTO;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.iker.Lexly.Entity.ChoiceRelatedTextePair;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data

public class QuestionDTO {
    private Long id;
    private String questionText;
    private String valueType;
    private String texte;
    private String description;
    private String descriptionDetails;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonIgnoreProperties("questionDto")
    private List<ChoiceRelatedTextePair> choiceRelatedTextePairs;

    public QuestionDTO( List<ChoiceRelatedTextePair> choiceRelatedTextePairs,Long id, String questionText, String valueType, String texte, String description, String descriptionDetails) {
        this.id = id;
        this.questionText = questionText;
        this.valueType = valueType;
        this.texte = texte;
        this.description = description;
        this.descriptionDetails = descriptionDetails;
        this.choiceRelatedTextePairs=choiceRelatedTextePairs;

    }
    @JsonProperty("choiceRelatedTextePairs")
    public List<ChoiceRelatedTextePair> getChoiceRelatedTextePairs() {
        return "checkbox".equalsIgnoreCase(valueType) ? choiceRelatedTextePairs : null;
    }
}
 