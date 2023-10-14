package com.iker.Lexly.Transformer;


import com.iker.Lexly.DTO.TemplateDTO;

import com.iker.Lexly.Entity.Template;
import org.springframework.stereotype.Component;

@Component
public class TemplateTransformer extends Transformer<Template,TemplateDTO>{

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
            return template;
        }
    }

    @Override
    public TemplateDTO toDTO(Template entity) {
        if (entity == null) {
            return null;
        } else {
            return new TemplateDTO(entity.getId(), entity.getTemplateName(), entity.getTemplateDescription(), entity.getCost());
        }
    }

}