package com.iker.Lexly.service;

import com.iker.Lexly.Entity.Question;
import com.iker.Lexly.Entity.Template;
import com.iker.Lexly.repository.QuestionRepository;
import com.iker.Lexly.repository.TemplateRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final TemplateRepository templateRepository;

    @Autowired
    public QuestionService(QuestionRepository questionRepository,TemplateRepository templateRepository) {
        this.questionRepository = questionRepository;
        this.templateRepository=templateRepository;
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Question getQuestionById(Long questionId) {
        return questionRepository.findById(questionId)
                .orElse(null);
    }
    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }

    public Question updateQuestion(Long id, String questionText, String valueType) {
        Optional<Question> existingQuestion = questionRepository.findById(id);
        if (existingQuestion.isPresent()) {
            Question updatedQuestion = existingQuestion.get();
            updatedQuestion.setQuestionText(questionText);
            updatedQuestion.setValueType(valueType);
            return questionRepository.save(updatedQuestion);
        } else {
            return null;
        }
    }
    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }

    public List<Question> findQuestionsByTemplateId(Long templateId) {
        return questionRepository.findByTemplateId(templateId);
    }

    public Question createQuestionByTemplateId(Long templateId, Question newQuestion) {
        Template template = templateRepository.findById(templateId)
                .orElseThrow(() -> new EntityNotFoundException("Template not found with ID: " + templateId));
        newQuestion.setTemplate(template);
        return questionRepository.save(newQuestion);
    }
}