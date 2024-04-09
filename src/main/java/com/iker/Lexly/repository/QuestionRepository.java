package com.iker.Lexly.repository;

import com.iker.Lexly.Entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository  extends JpaRepository<Question,Long> {

    List<Question> findByTemplateId(Long templateId);


    boolean existsByQuestionText(String questionText);
}