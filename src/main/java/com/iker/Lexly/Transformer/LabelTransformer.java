package com.iker.Lexly.Transformer;

import com.iker.Lexly.DTO.LabelDTO;
import com.iker.Lexly.Entity.Form.Label;
import org.springframework.stereotype.Component;

@Component
public class LabelTransformer extends Transformer<Label, LabelDTO> {

    @Override
    public Label toEntity(LabelDTO dto) {
        if (dto == null) {
            return null;
        } else {
            Label label = new Label();
            label.setId(dto.getId());
            label.setName(dto.getName());
            label.setType(dto.getType());
            label.setOptions(dto.getOptions());
            return label;
        }
    }

    @Override
    public LabelDTO toDTO(Label entity) {
        if (entity == null) {
            return null;
        } else {
            LabelDTO dto = new LabelDTO();
            dto.setId(entity.getId());
            dto.setName(entity.getName());
            dto.setType(entity.getType());
            dto.setOptions(entity.getOptions());
            return dto;
        }
    }
}
