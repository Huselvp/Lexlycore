package com.iker.Lexly.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TemplateDTO {
    private Long id;
    private String templateName;
    private String templateDescription;
    private float cost;


    public TemplateDTO(Long id, String templateName, String templateDescription, float cost) {
        this.id = id;
        this.templateName = templateName;
        this.templateDescription = templateDescription;
        this.cost = cost;
    }
}

