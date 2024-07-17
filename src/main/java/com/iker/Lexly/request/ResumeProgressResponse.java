package com.iker.Lexly.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResumeProgressResponse {
    private Long lastAnsweredQuestionId;
    private List<UserInputs> userInputs;
    private boolean status;
}
