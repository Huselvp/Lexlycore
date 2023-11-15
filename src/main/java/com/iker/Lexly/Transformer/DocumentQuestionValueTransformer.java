package com.iker.Lexly.Transformer;

import com.iker.Lexly.DTO.DocumentQuestionValueDTO;
import com.iker.Lexly.Entity.DocumentQuestionValue;
import com.iker.Lexly.Entity.Question;
import com.iker.Lexly.repository.QuestionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class DocumentQuestionValueTransformer extends Transformer<DocumentQuestionValue, DocumentQuestionValueDTO> {
    @Autowired
    private QuestionRepository questionRepository;

    @Override
    public DocumentQuestionValue toEntity(DocumentQuestionValueDTO dto) {
        if (dto == null) {
            return null;
        } else {
            DocumentQuestionValue entity = new DocumentQuestionValue();
            entity.setDocumentQuestionValueId(dto.getDocumentQuestionValueId());
            entity.setValue(dto.getValue());
            Question question = questionRepository.findById(dto.getQuestionId())
                    .orElseThrow(() -> new EntityNotFoundException("Question not found with ID: " + dto.getQuestionId()));

            entity.setQuestion(question);

            return entity;
        }
    }

    @Override
    public DocumentQuestionValueDTO toDTO(DocumentQuestionValue entity) {
        if (entity == null) {
            return null;
        } else {
            DocumentQuestionValueDTO dto = new DocumentQuestionValueDTO();
            dto.setDocumentQuestionValueId(entity.getDocumentQuestionValueId());
            dto.setValue(entity.getValue());
            dto.setQuestionId(entity.getQuestion().getId());

            return dto;
        }
    }

    public List<DocumentQuestionValue> toEntityList(List<DocumentQuestionValueDTO> dtos) {
        return dtos.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }

    public List<DocumentQuestionValueDTO> toDTOList(List<DocumentQuestionValue> entities) {
        return entities.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}
