package com.iker.Lexly.repository;

import com.iker.Lexly.Entity.SubQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubQuestionRepository extends JpaRepository<SubQuestion, Long> {

    List<SubQuestion> findByParentQuestionId(Long questionId);

    List<SubQuestion> findByParentSubQuestionId(Long SubQuestionId);
}
