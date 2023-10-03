package com.iker.Lexly.repository;


import com.iker.Lexly.Entity.DocsTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface TemplateRepository extends JpaRepository<DocsTemplate, Long> {
    Optional<DocsTemplate> findByName(String name);
    DocsTemplate save(DocsTemplate template);

}

