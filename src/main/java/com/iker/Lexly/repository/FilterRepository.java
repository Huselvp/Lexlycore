package com.iker.Lexly.repository;

import com.iker.Lexly.Entity.Filter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FilterRepository  extends JpaRepository<Filter, Long> {
    void deleteByQuestionId(Long questionId);

    Optional<Filter> findByQuestionId(Long questionId);
}
