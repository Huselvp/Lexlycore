package com.iker.Lexly.DTO;

import com.iker.Lexly.Entity.Subcategory;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TemplateDTO {
    private Long id;
    private String templateName;
    private String templateDescription;
    private float cost;
    private String content;
    private Subcategory subcategory;


    public TemplateDTO(Long id, String content,String templateName, String templateDescription, float cost, Subcategory subcategory) {
        this.id = id;
        this.subcategory=subcategory;
        this.templateName = templateName;
        this.content=content;
        this.templateDescription = templateDescription;
        this.cost = cost;
    }

    public void getSubcategory(Subcategory subcategory) {
        this.subcategory=subcategory;
    }
}

