package com.iker.Lexly.service;

import com.iker.Lexly.DTO.SubQuestionDTO;
import com.iker.Lexly.Entity.Question;
import com.iker.Lexly.Entity.SubQuestion;
import com.iker.Lexly.DTO.QuestionDTO;
import com.iker.Lexly.repository.QuestionRepository;
import com.iker.Lexly.repository.SubQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class SubQuestionService {

    private final SubQuestionRepository subQuestionRepository;
    private final QuestionRepository questionRepository;

    @Autowired
    public SubQuestionService(SubQuestionRepository subQuestionRepository, QuestionRepository questionRepository) {
        this.subQuestionRepository = subQuestionRepository;
        this.questionRepository= questionRepository;
    }

    @Transactional(readOnly = true)
    public List<SubQuestion> getAllSubQuestionsByQuestionId(Long questionId) {
        return subQuestionRepository.findByParentQuestionId(questionId);
    }

    @Transactional
    public SubQuestion createSubQuestion(Long questionId, SubQuestionDTO subQuestionDTO) {
        Question parentQuestion = questionRepository.getById(questionId);
        SubQuestion subQuestion = new SubQuestion();
        subQuestion.setQuestionText(subQuestionDTO.getQuestionText());
        subQuestion.setDescription(subQuestionDTO.getDescription());
        subQuestion.setDescriptionDetails(subQuestionDTO.getDescriptionDetails());
        subQuestion.setValueType(subQuestionDTO.getValueType());
        subQuestion.setTextArea(subQuestionDTO.getTextArea());
        subQuestion.setParentQuestion(parentQuestion);
        return subQuestionRepository.save(subQuestion);
    }

    @Transactional(readOnly = true)
    public SubQuestion getSubQuestionById(Long subQuestionId) {
        return subQuestionRepository.findById(subQuestionId)
                .orElseThrow(() -> new IllegalArgumentException("Subquestion not found"));
    }

    @Transactional
    public SubQuestion updateSubQuestion(Long questionId, Long subQuestionId, SubQuestionDTO subQuestionDTO) {
        Optional<SubQuestion> subQuestionOptional = subQuestionRepository.findById(subQuestionId);
        if (subQuestionOptional.isPresent()) {
            SubQuestion subQuestion = subQuestionOptional.get();
            if (subQuestionDTO.getQuestionText() != null) {
                subQuestion.setQuestionText(subQuestionDTO.getQuestionText());
            }
            if (subQuestionDTO.getDescription() != null) {
                subQuestion.setDescription(subQuestionDTO.getDescription());
            }
            if (subQuestionDTO.getDescriptionDetails() != null) {
                subQuestion.setDescriptionDetails(subQuestionDTO.getDescriptionDetails());
            }
            if (subQuestionDTO.getValueType() != null) {
                subQuestion.setValueType(subQuestionDTO.getValueType());
            }
            if (subQuestionDTO.getTextArea() != null) {
                subQuestion.setTextArea(subQuestionDTO.getTextArea());
            }
            return subQuestionRepository.save(subQuestion);
        } else {
            throw new IllegalArgumentException("Subquestion not found");
        }
    }


    @Transactional
    public void deleteSubQuestion(Long subQuestionId) {
        if (subQuestionRepository.existsById(subQuestionId)) {
            subQuestionRepository.deleteById(subQuestionId);
        } else {
            throw new IllegalArgumentException("Subquestion not found");
        }
    }
}
