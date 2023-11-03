package com.iker.Lexly.repository;

import com.iker.Lexly.Entity.DocumentQuestionValue;
import com.iker.Lexly.Entity.Documents;
import com.iker.Lexly.Entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentQuestionValueRepository extends JpaRepository<DocumentQuestionValue,Long> {
    static void deleteByTemplateId(Long templateId) {
    }

    List<DocumentQuestionValue> findByDocumentId(Long documentId);

    DocumentQuestionValue findByDocumentAndQuestion(Documents document, Question question);
}
