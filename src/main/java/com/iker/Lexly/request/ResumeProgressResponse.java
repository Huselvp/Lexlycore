package com.iker.Lexly.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeProgressResponse {
    private Long lastAnsweredQuestionId;
    private List<UserInputs> userInputs;
    private boolean status;
}
