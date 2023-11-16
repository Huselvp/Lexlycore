package com.iker.Lexly.repository;


import com.iker.Lexly.Entity.ChoiceRelatedTextePair;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChoicesRelatedTexteRepository extends JpaRepository<ChoiceRelatedTextePair, Long> {
        void deleteByQuestionId(Long questionId);
    }


