package com.iker.Lexly.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Builder
public class TemplateDTO {
    private Long id;
    private String templateName;
    private String templateDescription;
    private float cost;
    private CategoryDTO category;

    public TemplateDTO(Long id, String templateName, String templateDescription, float cost, CategoryDTO category) {
        this.id = id;
        this.templateName = templateName;
        this.templateDescription = templateDescription;
        this.cost = cost;
        this.category = category;
    }
}
