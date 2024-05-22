package com.iker.Lexly.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data

public class FormValues {
    private long  blockId;
    private long  labelId;
    private String LabelValue;

}
