package com.iker.Lexly.Transformer;

import com.iker.Lexly.DTO.CategoryDTO;
import com.iker.Lexly.DTO.DocumentQuestionValueDTO;
import com.iker.Lexly.DTO.TemplateDTO;
import com.iker.Lexly.Entity.DocumentQuestionValue;
import com.iker.Lexly.Entity.Template;
import com.iker.Lexly.Entity.Category; // Import the Category entity

import com.iker.Lexly.Transformer.Transformer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TemplateTransformer extends Transformer<Template, TemplateDTO> {

    @Autowired
    private CategoryTransformer categoryTransformer;

    @Autowired
    private DocumentQuestionValueTransformer documentQuestionValueTransformer;

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
            template.setCategory(dto.getCategory());
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
            dto.setCategory(entity.getCategory());
            return dto;
        }
    }
}

