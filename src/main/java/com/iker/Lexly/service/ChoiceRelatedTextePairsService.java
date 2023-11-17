package com.iker.Lexly.service;

import com.iker.Lexly.Entity.Question;
import com.iker.Lexly.repository.QuestionRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;



@Service
public class ChoiceRelatedTextePairsService {

    private final QuestionRepository questionRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public ChoiceRelatedTextePairsService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }
    @Transactional
    public void deleteChoicesByQuestionId(Long questionId) {
        entityManager.createQuery("UPDATE DocumentQuestionValue d SET d.question.id = null WHERE d.question.id = :questionId")
                .setParameter("questionId", questionId)
                .executeUpdate();
        entityManager.createQuery("DELETE FROM ChoiceRelatedTextePair c WHERE c.question.id = :questionId")
                .setParameter("questionId", questionId)
                .executeUpdate();
        questionRepository.deleteById(questionId);
    }


}
