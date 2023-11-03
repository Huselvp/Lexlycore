package com.iker.Lexly.DTO;

import com.iker.Lexly.Entity.ChoiceRelatedTextePair;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@Builder
public class QuestionDTO {
    private Long id;
    private String questionText;
    private String valueType;
    private String Texte;
    private String Description;
    private String DescriptionDetails;
    private List<ChoiceRelatedTextePair> choices;


    public QuestionDTO(Long id, String questionText, String valueType, String texte, String description, String descriptionDetails, List<ChoiceRelatedTextePair> choices) {
        this.id = id;
        this.questionText = questionText;
        this.valueType = valueType;
        this.Texte = texte;
        this.Description = description;
        this.DescriptionDetails = descriptionDetails;
        this.choices = choices;
    }
}
 