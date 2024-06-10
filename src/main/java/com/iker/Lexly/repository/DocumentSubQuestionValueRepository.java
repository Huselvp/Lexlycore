package com.iker.Lexly.repository;


import com.iker.Lexly.Entity.DocumentQuestionValue;
import com.iker.Lexly.Entity.DocumentSubQuestionValue;
import com.iker.Lexly.Entity.Documents;
import com.iker.Lexly.Entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentSubQuestionValueRepository extends JpaRepository<DocumentSubQuestionValue,Long> {

}