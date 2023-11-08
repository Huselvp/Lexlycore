package com.iker.Lexly.DTO;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
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
    private CategoryDTO categoryDTO;


    public TemplateDTO(Long id, String templateName, String templateDescription, float cost,CategoryDTO categoryDTO) {
        this.id = id;
        this.templateName = templateName;
        this.templateDescription = templateDescription;
        this.cost = cost;
        this.categoryDTO=categoryDTO;

    }

}
