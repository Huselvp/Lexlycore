package com.iker.Lexly.Transformer;

import com.iker.Lexly.DTO.FormDTO;
import com.iker.Lexly.Entity.Form.Form;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class FormTransformer extends Transformer<Form, FormDTO> {


    @Override
    public Form toEntity(FormDTO dto) {
        if (dto == null) {
            return null;
        } else {
            Form form = new Form();
            form.setId(dto.getId());
            form.setTitle(dto.getTitle());

            return form;
        }
    }

    @Override
    public FormDTO toDTO(Form entity) {
        if (entity == null) {
            return null;
        } else {
            FormDTO dto = new FormDTO();
            dto.setId(entity.getId());
            dto.setTitle(entity.getTitle());

            return dto;
        }
    }
}
