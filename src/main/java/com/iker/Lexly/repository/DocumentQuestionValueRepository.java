package com.iker.Lexly.repository;

import com.iker.Lexly.Entity.DocumentQuestionValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentQuestionValueRepository extends JpaRepository<DocumentQuestionValue,Long> {
    List<DocumentQuestionValue> findByDocumentId(Long documentId);
}
