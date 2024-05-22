package com.iker.Lexly.request;

import com.iker.Lexly.DTO.DocumentQuestionValueDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FormValuesRequest {
    private Long Id;
    private List<FormValues> formValues;


}