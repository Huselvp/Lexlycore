package com.iker.Lexly.repository.form;

import com.iker.Lexly.Entity.Form.Block;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlockRepository extends JpaRepository<Block,Long> {
    List<Block> findByFormId(Long formId);

    boolean existsByFormIdAndNumberOfBloc(Long formId, int numberOfBloc);
    int countByFormId(Long formId);
}
