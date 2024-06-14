package com.iker.Lexly.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class DayRequest {
    private Long index;
    private String day;
}
