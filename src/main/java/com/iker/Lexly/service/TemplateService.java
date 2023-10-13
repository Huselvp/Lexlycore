package com.iker.Lexly.service;

import com.iker.Lexly.Entity.Template;
import com.iker.Lexly.repository.TemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TemplateService {
    private final TemplateRepository templateRepository;

    @Autowired
    public TemplateService(TemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
    }

    public List<Template> getAllTemplates() {
        return templateRepository.findAll();
    }

    public Optional<Template> getTemplateById(Long id) {
        return templateRepository.findById(id);
    }

    public Template createTemplate(Template template) {
        return templateRepository.save(template);
    }

    public Template updateTemplate(Long id, Template template) {
        Optional<Template> existingTemplate = templateRepository.findById(id);
        if (existingTemplate.isPresent()) {
            // Update the existing template with the new values
            Template updatedTemplate = existingTemplate.get();
            updatedTemplate.setTemplateName(template.getTemplateName());
            updatedTemplate.setTemplateDescription(template.getTemplateDescription());
            //updatedTemplate.setCategory(template.getCategory());
            updatedTemplate.setCost(template.getCost());
            return templateRepository.save(updatedTemplate);
        } else {
            // Handle the case where the template with the given ID doesn't exist
            return null; // You can return an appropriate response or throw an exception
        }
    }

    public void deleteTemplate(Long id) {
        templateRepository.deleteById(id);
    }
}