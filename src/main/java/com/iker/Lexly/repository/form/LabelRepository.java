package com.iker.Lexly.repository.form;

import com.iker.Lexly.Entity.Form.Label;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LabelRepository extends JpaRepository<Label,Long> {
    List<Label> findByBlockId(Long blockId);
    int countByBlockId(Long BlockId);
}
