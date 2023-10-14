package com.iker.Lexly.Transformer;

import com.iker.Lexly.DTO.TemplateQuestionValueDTO;
import com.iker.Lexly.Entity.TemplateQuestionValue;
import org.springframework.stereotype.Component;

@Component
public class TemplateQuestionValueTransformer extends Transformer<TemplateQuestionValue, TemplateQuestionValueDTO>{

    @Override
    public TemplateQuestionValue toEntity(TemplateQuestionValueDTO dto) {
        if (dto == null) {
            return null;
        } else {
           TemplateQuestionValue templateQuestionValue = new TemplateQuestionValue();
            templateQuestionValue.setId(dto.getId());
            templateQuestionValue.setValueType(dto.getValueType());

            return templateQuestionValue;
        }
    }

    @Override
    public TemplateQuestionValueDTO toDTO(TemplateQuestionValue entity) {
        if (entity == null) {
            return null;
        } else {
            return new TemplateQuestionValueDTO(entity.getId(),entity.getValueType());
        }
    }
    }


