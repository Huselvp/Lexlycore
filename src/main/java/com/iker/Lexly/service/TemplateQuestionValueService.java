package com.iker.Lexly.service;

import com.iker.Lexly.Entity.*;
import com.iker.Lexly.repository.TemplateQuestionValueRepository;


import com.iker.Lexly.Entity.TemplateQuestionValue;
import com.iker.Lexly.repository.TemplateQuestionValueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TemplateQuestionValueService {
    private final TemplateQuestionValueRepository templateQuestionValueRepository;

    @Autowired
    public TemplateQuestionValueService(TemplateQuestionValueRepository templateQuestionValueRepository) {
        this.templateQuestionValueRepository = templateQuestionValueRepository;
    }
    public List<TemplateQuestionValue> createTemplateQuestionValues(List<TemplateQuestionValue> templateQuestionValues) {
        return templateQuestionValueRepository.saveAll(templateQuestionValues);
    }

    public void deleteTemplateQuestionValue(Long id) {
        templateQuestionValueRepository.deleteById(id);
    }

    public TemplateQuestionValue updateTemplateQuestionValue(Long id, TemplateQuestionValue updatedTemplateQuestionValue) {
        TemplateQuestionValue existingTemplateQuestionValue = templateQuestionValueRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("TemplateQuestionValue not found"));
        existingTemplateQuestionValue.setValueType(updatedTemplateQuestionValue.getValueType());
        return templateQuestionValueRepository.save(existingTemplateQuestionValue);
    }


}