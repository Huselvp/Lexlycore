package com.iker.Lexly.service;

import com.iker.Lexly.DTO.SubQuestionDTO;
import com.iker.Lexly.Entity.Question;
import com.iker.Lexly.Entity.SubQuestion;
import com.iker.Lexly.DTO.QuestionDTO;
import com.iker.Lexly.Entity.Template;
import com.iker.Lexly.repository.QuestionRepository;
import com.iker.Lexly.repository.SubQuestionRepository;
import com.iker.Lexly.repository.SubcategoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SubQuestionService {

    private final SubQuestionRepository subQuestionRepository;
    private final QuestionRepository questionRepository;
    private final SubcategoryRepository subcategoryRepository;
    private static final Logger logger = LoggerFactory.getLogger(SubQuestionService.class);
    @Autowired
    public SubQuestionService(SubQuestionRepository subQuestionRepository, QuestionRepository questionRepository, SubcategoryRepository subcategoryRepository) {
        this.subQuestionRepository = subQuestionRepository;
        this.questionRepository= questionRepository;
        this.subcategoryRepository = subcategoryRepository;
    }

    @Transactional(readOnly = true)
    public List<SubQuestion> getAllSubQuestionsByQuestionId(Long questionId) {
        return subQuestionRepository.findByParentQuestionId(questionId);
    }

//    public List<SubQuestion> getAllSubQuestionsBySubquestionOrder(Long questionId ) {
//        Question question = questionRepository.findById(questionId)
//                .orElseThrow(() -> new IllegalArgumentException("Template not found"));
//        List<Long> orderSubquestions=question.getSubquestionOrder();
//        if (orderSubquestions == null || orderSubquestions.isEmpty()) {
//            return subQuestionRepository.findByParentQuestionId(questionId);
//        }
//        return orderSubquestions.stream()
//                .map(orderId -> subQuestionRepository.findById(orderId).orElse(null))
//                .filter(subQuestion -> subQuestion != null)
//                .collect(Collectors.toList());
//    }

//    @Transactional
//    public void updateSubQuestionOrder(Long questionId, List<Long> subQuestionOrder) {
//        Question parentQuestion = questionRepository.findById(questionId)
//                .orElseThrow(() -> new IllegalArgumentException("Parent question not found"));
//        parentQuestion.setSubquestionOrder(subQuestionOrder);
//        questionRepository.save(parentQuestion);
//    }

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
        SubQuestion subQuestionsaved = subQuestionRepository.save(subQuestion);
        subQuestionsaved.setPosition(subQuestionsaved.getId().intValue());
        logger.info("Created Subquestion successfully :{}",subQuestionsaved );
        return subQuestionsaved;
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
            SubQuestion subQuestionsaved = subQuestionRepository.save(subQuestion);
            logger.info("Updated Subquestion successfully :{}",subQuestionsaved );
            return subQuestionsaved;
        } else {
            throw new IllegalArgumentException("Subquestion not found");
        }
    }

    public void reorderSubQuestions(Long questionId, List<Long> subQuestionsIds) {

        Set<Long> uniqueSubQuestionIds = new HashSet<>(subQuestionsIds);
        if (uniqueSubQuestionIds.size() < subQuestionsIds.size()) {
            throw new IllegalArgumentException("Duplicate user IDs found in the list.");
        }
        List<SubQuestion> subQuestions = subQuestionRepository.findAllById(subQuestionsIds);
        for (int i = 0; i < subQuestionsIds.size(); i++) {
            long subQuestionId = subQuestionsIds.get(i);
            SubQuestion subQuestion = subQuestions.stream().filter(u -> u.getId().equals(subQuestionId)).findFirst().orElse(null);
            if (subQuestion != null) {
                subQuestion.setPosition(i);
                subQuestionRepository.save(subQuestion);
            }
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
