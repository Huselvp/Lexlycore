package com.iker.Lexly.repository;

import com.iker.Lexly.Entity.Template;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TemplateRepository extends JpaRepository<Template,Long> {
    Template findByDocumentId(Long documentId);
}
