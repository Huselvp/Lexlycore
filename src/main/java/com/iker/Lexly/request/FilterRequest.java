package com.iker.Lexly.request;

import com.iker.Lexly.Entity.enums.FilterType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FilterRequest {
    private FilterType filterType;
    private String filterStart;
    private String filterEnd;
}
