package com.iker.Lexly.request;

import com.iker.Lexly.DTO.DocumentQuestionValueDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckboxValue {

    private String value;
    private String relatedText;

}