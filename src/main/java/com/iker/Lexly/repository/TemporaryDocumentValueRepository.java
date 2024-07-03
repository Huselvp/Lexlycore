package com.iker.Lexly.repository;

import com.iker.Lexly.Entity.Documents;
import com.iker.Lexly.Entity.TemporaryDocumentValue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TemporaryDocumentValueRepository extends JpaRepository<TemporaryDocumentValue, Long> {
    List<TemporaryDocumentValue> findByDocument(Documents document);
    void deleteByDocumentId(Documents document);
}
