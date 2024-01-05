package com.iker.Lexly.repository;

import com.iker.Lexly.Entity.Template;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TemplateRepository extends JpaRepository<Template,Long> {
   // List<Template> findByCategoryId(Long categoryId);

    List<Template> findByUserId(Long userId);
}
