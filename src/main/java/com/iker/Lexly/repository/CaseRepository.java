package com.iker.Lexly.repository;

import com.iker.Lexly.Entity.Case;
import com.iker.Lexly.Entity.enums.CaseType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CaseRepository extends JpaRepository<Case,Long> {
 List<Case> findByType(CaseType type);

}
