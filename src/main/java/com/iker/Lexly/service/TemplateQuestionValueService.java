package com.iker.Lexly.service;

import com.iker.Lexly.Entity.TemplateQuestionValue;
import com.iker.Lexly.repository.TemplateQuestionValueRepository;


import com.iker.Lexly.Entity.TemplateQuestionValue;
import com.iker.Lexly.repository.TemplateQuestionValueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
        // Find the existing TemplateQuestionValue by ID
        TemplateQuestionValue existingTemplateQuestionValue = templateQuestionValueRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("TemplateQuestionValue not found"));

        // Update the existing TemplateQuestionValue with the new values
        existingTemplateQuestionValue.setValue(updatedTemplateQuestionValue.getValue());
        existingTemplateQuestionValue.setValueType(updatedTemplateQuestionValue.getValueType());

        // Save the updated TemplateQuestionValue
        return templateQuestionValueRepository.save(existingTemplateQuestionValue);
    }
}