package com.iker.Lexly.repository;

import com.iker.Lexly.Entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository  extends JpaRepository<Question,Long> {
    Question findByQuestionText(String questionText);

    List<Question> findByTemplateId(Long templateId);


    boolean existsByTemplateIdAndQuestionText(Long templateId, String questionText);

    boolean existsByQuestionText(String questionText);
}