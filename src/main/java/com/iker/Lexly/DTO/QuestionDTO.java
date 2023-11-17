package com.iker.Lexly.DTO;

import com.iker.Lexly.Entity.ChoiceRelatedTextePair;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class QuestionDTO {
    private Long id;
    private String questionText;
    private String valueType;
    private String Texte;
    private String Description;
    private String DescriptionDetails;
    private List<ChoiceRelatedTextePair> choiceRelatedTextePairs;

    public QuestionDTO( List<ChoiceRelatedTextePair> choiceRelatedTextePairs,Long id, String questionText, String valueType, String texte, String description, String descriptionDetails) {
        this.id = id;
        this.questionText = questionText;
        this.valueType = valueType;
        this.Texte = texte;
        this.Description = description;
        this.DescriptionDetails = descriptionDetails;
        this.choiceRelatedTextePairs=choiceRelatedTextePairs;

    }
}
 