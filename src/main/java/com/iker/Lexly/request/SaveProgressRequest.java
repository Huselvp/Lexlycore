package com.iker.Lexly.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaveProgressRequest {
    private Long documentId;
    private Long lastAnsweredQuestionId;
    private List<UserInputs> values;
}
