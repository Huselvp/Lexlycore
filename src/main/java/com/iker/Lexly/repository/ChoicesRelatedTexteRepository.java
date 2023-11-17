package com.iker.Lexly.repository;


import com.iker.Lexly.Entity.ChoiceRelatedTextePair;
import com.iker.Lexly.Entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChoicesRelatedTexteRepository extends JpaRepository<ChoiceRelatedTextePair, Long> {
    @Modifying
    @Query("DELETE FROM ChoiceRelatedTextePair c WHERE c.question.id = :questionId")
    void deleteChoicesByQuestionId(@Param("questionId") Long questionId);


    List<ChoiceRelatedTextePair> findByQuestion(Question question);
}


