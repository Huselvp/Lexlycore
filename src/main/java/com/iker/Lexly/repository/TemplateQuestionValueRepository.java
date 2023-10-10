package com.iker.Lexly.repository;

import com.iker.Lexly.Entity.TemplateQuestionValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TemplateQuestionValueRepository extends JpaRepository<TemplateQuestionValue,Long> {
}
