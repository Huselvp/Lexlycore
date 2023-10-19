package com.iker.Lexly.service;

import com.iker.Lexly.Entity.Question;
import com.iker.Lexly.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {
    private final QuestionRepository questionRepository;

    @Autowired
    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
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
}