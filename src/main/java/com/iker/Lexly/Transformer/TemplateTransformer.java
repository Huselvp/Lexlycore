package com.iker.Lexly.Transformer;

import com.iker.Lexly.DTO.CategoryDTO;
import com.iker.Lexly.DTO.TemplateDTO;
import com.iker.Lexly.Entity.Template;
import com.iker.Lexly.Entity.Category; // Import the Category entity

import com.iker.Lexly.Transformer.Transformer;
import org.springframework.stereotype.Component;

@Component
public class TemplateTransformer extends Transformer<Template, TemplateDTO> {

    @Override
    public Template toEntity(TemplateDTO dto) {
        if (dto == null) {
            return null;
        } else {
            Template template = new Template();
            template.setId(dto.getId());
            template.setCost(dto.getCost());
            template.setTemplateName(dto.getTemplateName());
            template.setTemplateDescription(dto.getTemplateDescription());
            // If you have a CategoryDTO in TemplateDTO, you may set it here.
            // template.setCategory(/* Map CategoryDTO to Category entity here */);
            return template;
        }
    }

    @Override
    public TemplateDTO toDTO(Template entity) {
        if (entity == null) {
            return null;
        } else {
            TemplateDTO dto = new TemplateDTO();
            dto.setId(entity.getId());
            dto.setCost(entity.getCost());
            dto.setTemplateName(entity.getTemplateName());
            dto.setTemplateDescription(entity.getTemplateDescription());

            Category category = entity.getCategory();
            if (category != null) {
                CategoryDTO categoryDTO = new CategoryDTO();
                categoryDTO.setId(category.getId());
                categoryDTO.setCategory(category.getCategory());
                dto.setCategory(categoryDTO);
            } else {
                dto.setCategory(null);
            }
            return dto;
        }
    }

}
