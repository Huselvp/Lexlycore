package com.iker.Lexly.request;

import com.iker.Lexly.Entity.ChoiceRelatedTextePair;
import lombok.Data;

import java.util.List;

@Data
public class QuestionWithChoicesRequest {
    private String questionText;
    private String valueType;
    private List<ChoiceRelatedTextePair> choices;
}
