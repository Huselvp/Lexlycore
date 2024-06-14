package com.iker.Lexly.Transformer;
import com.iker.Lexly.DTO.QuestionDTO;
import com.iker.Lexly.DTO.SubQuestionDTO;
import com.iker.Lexly.Entity.Form.Form;
import com.iker.Lexly.Entity.Question;
import com.iker.Lexly.Entity.SubQuestion;
import com.iker.Lexly.repository.form.FormRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class QuestionTransformer extends Transformer<Question, QuestionDTO> {

    private final FormTransformer formTransformer;
    private final FormRepository formRepository;
    @Autowired
    public QuestionTransformer(FormTransformer formTransformer, FormRepository formRepository) {
        this.formTransformer = formTransformer;
        this.formRepository = formRepository;
    }

    @Override
    public Question toEntity(QuestionDTO dto) {
        if (dto == null) {
            return null;
        } else {
            Question question = new Question();
            question.setId(dto.getId());
            question.setQuestionText(dto.getQuestionText());
            question.setValueType(dto.getValueType());
            question.setTexte(dto.getTexte());
            question.setDescription(dto.getDescription());
            question.setDescriptionDetails(dto.getDescriptionDetails());
            return question;
        }
    }

    public QuestionDTO toDTO(Question entity) {
        if (entity == null) {
            return null;
        } else {
            QuestionDTO dto = new QuestionDTO();
            dto.setId(entity.getId());
            dto.setQuestionText(entity.getQuestionText());
            dto.setDescription(entity.getDescription());
            dto.setDescriptionDetails(entity.getDescriptionDetails());
            dto.setValueType(entity.getValueType());
            dto.setTexte(entity.getTexte());
            List<SubQuestionDTO> subQuestionDTOList = entity.getSubQuestions().stream()
                    .map(this::mapToSubQuestionDTO)
                    .collect(Collectors.toList());
            dto.setSubQuestions(subQuestionDTOList);

            return dto;
        }
    }
    private SubQuestionDTO mapToSubQuestionDTO(SubQuestion subQuestion) {
        SubQuestionDTO subQuestionDTO = new SubQuestionDTO();
        subQuestionDTO.setQuestionText(subQuestion.getQuestionText());
        subQuestionDTO.setDescription(subQuestion.getDescription());
        subQuestionDTO.setDescriptionDetails(subQuestion.getDescriptionDetails());
        subQuestionDTO.setValueType(subQuestion.getValueType());
        subQuestionDTO.setTextArea(subQuestion.getTextArea());
        if ("form".equals(subQuestion.getValueType())) {
            Optional<Form> formOptional = formRepository.findByQuestionId(subQuestion.getId());
            formOptional.ifPresent(form -> subQuestionDTO.setForm(formTransformer.toDTO(form)));
        }
        return subQuestionDTO;
    }
}



