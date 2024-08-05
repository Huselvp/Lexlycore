package com.iker.Lexly.Transformer;

import com.iker.Lexly.DTO.SubQuestionDTO;
import com.iker.Lexly.Entity.SubQuestion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class SubQuestionTransformer extends Transformer<SubQuestion, SubQuestionDTO> {

    private final FormTransformer formTransformer;


    @Autowired
    public SubQuestionTransformer(FormTransformer formTransformer) {
        this.formTransformer = formTransformer;

    }

    @Override
    public SubQuestion toEntity(SubQuestionDTO dto) {
        if (dto == null) {
            return null;
        } else {
            SubQuestion subQuestion = new SubQuestion();
            subQuestion.setId(dto.getId());
            subQuestion.setQuestionText(dto.getQuestionText());
            subQuestion.setDescription(dto.getDescription());
            subQuestion.setDescriptionDetails(dto.getDescriptionDetails());
            subQuestion.setValueType(dto.getValueType());
            subQuestion.setTextArea(dto.getTextArea());
            // Note: We don't set the form or filter here as they are typically
            // managed by the parent question or separate repository operations
            return subQuestion;
        }
    }

    @Override
    public SubQuestionDTO toDTO(SubQuestion entity) {
        if (entity == null) {
            return null;
        } else {
            SubQuestionDTO dto = new SubQuestionDTO();
            dto.setId(entity.getId());
            dto.setQuestionText(entity.getQuestionText());
            dto.setDescription(entity.getDescription());
            dto.setDescriptionDetails(entity.getDescriptionDetails());
            dto.setValueType(entity.getValueType());
            dto.setTextArea(entity.getTextArea());
            return dto;
        }
    }
    public SubQuestionDTO convertToDTOWithSubQuestions(SubQuestion subQuestion) {
        SubQuestionDTO subQuestionDTO = toDTO(subQuestion);
        List<SubQuestion> subSubQuestions = subQuestion.getSubQuestions();
        List<SubQuestionDTO> subSubQuestionDTOs = subSubQuestions.stream()
                .map(this::convertToDTOWithSubQuestions)
                .collect(Collectors.toList());
        subQuestionDTO.setSubQuestions(subSubQuestionDTOs);
        return subQuestionDTO;
    }

    public SubQuestionDTO toDTOWithSubQuestions(SubQuestion subQuestion) {
        return toDTO(subQuestion); // Appel de la méthode toDTO qui gère déjà les sous-questions
    }
}

