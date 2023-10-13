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

    public Optional<Question> getQuestionById(Long id) {
        return questionRepository.findById(id);
    }

    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }

    public Question updateQuestion(Long id, Question question) {
        Optional<Question> existingQuestion = questionRepository.findById(id);

        if (existingQuestion.isPresent()) {
            // Update the existing question with the new values
            Question updatedQuestion = existingQuestion.get();
            updatedQuestion.setQuestionText(question.getQuestionText());

            return questionRepository.save(updatedQuestion);
        } else {
            // Handle the case where the question with the given ID doesn't exist
            return null; // You can return an appropriate response or throw an exception
        }
    }

    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }
}