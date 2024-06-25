package com.iker.Lexly.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInputsSubQuestion {
    private Long subQuestionId;
    private String value;
    private LocalTime firstTimeValues;
    private LocalTime secondTimeValue;
    private LocalDate dateValue;
    private List<FormValues> formValues;
    private List<String> checkboxValue;
    private List<DayRequest> days;
    private Map<Long,String> mapValues;
}
