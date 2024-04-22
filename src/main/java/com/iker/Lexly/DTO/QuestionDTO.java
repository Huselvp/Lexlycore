package com.iker.Lexly.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data

public class QuestionDTO {
    private Long id;
    private String questionText;
    private String valueType;
    private String texte;
    private String description;
    private String descriptionDetails;
    private List<SubQuestionDTO> subQuestions;



    public QuestionDTO( Long id, String questionText, String valueType, String texte, String description, String descriptionDetails) {
        this.id = id;
        this.questionText = questionText;
        this.valueType = valueType;
        this.texte = texte;
        this.description = description;
        this.descriptionDetails = descriptionDetails;


    }

    public QuestionDTO() {

    }
}
 