package com.iker.Lexly.repository.form;
import com.iker.Lexly.Entity.Form.Form;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FormRepository extends JpaRepository<Form, Long> {
    Optional<Form> findByQuestionId(Long questionId);
    void deleteByQuestionId(Long questionId);

}
