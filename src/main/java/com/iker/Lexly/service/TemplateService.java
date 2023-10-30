package com.iker.Lexly.service;

import com.iker.Lexly.DTO.TemplateDTO;
import com.iker.Lexly.Entity.Category;
import com.iker.Lexly.Entity.Question;
import com.iker.Lexly.Entity.Template;
import com.iker.Lexly.repository.CategoryRepository;
import com.iker.Lexly.repository.QuestionRepository;
import com.iker.Lexly.repository.TemplateRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TemplateService {
    private final TemplateRepository templateRepository;
    private final CategoryRepository categoryRepository;
    @Autowired
    private final CategoryService categoryService;
    private final QuestionRepository questionRepository;

    @Autowired
    public TemplateService(CategoryService categoryService,QuestionRepository questionRepository,CategoryRepository categoryRepository, TemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
        this.categoryRepository = categoryRepository;
        this.categoryService=categoryService;
        this.questionRepository=questionRepository;
    }

    public List<Template> getAllTemplates() {
        return templateRepository.findAll();
    }

    public Template getTemplateById(Long templateId) {
        return templateRepository.findById(templateId)
                .orElse(null);
    }

    public Template updateTemplate(Long templateId, Template updatedTemplate) {

        Template existingTemplate = templateRepository.findById(templateId)
                .orElse(null);

        if (existingTemplate != null) {
            existingTemplate.setCost(updatedTemplate.getCost());
            existingTemplate.setTemplateName(updatedTemplate.getTemplateName());
            existingTemplate.setTemplateDescription(updatedTemplate.getTemplateDescription());
            existingTemplate.setCategory(updatedTemplate.getCategory());
            return templateRepository.save(existingTemplate);
        } else {
            return null;
        }
    }

    public void deleteTemplatesByCategoryId(Long categoryId) {
        List<Template> templates = templateRepository.findByCategoryId(categoryId);
        for (Template template : templates) {
            deleteTemplate(template.getId());
        }
    }

    public void deleteTemplate(Long templateId) {
        Template template = templateRepository.findById(templateId)
                .orElseThrow(() -> new EntityNotFoundException("Template not found with ID: " + templateId));
        templateRepository.delete(template);
    }
    public Template createTemplate(Template template) {
        return templateRepository.save(template);
    }


    public List<Template> getAllTemplatesByUserId(Long userId) {
        return templateRepository.findByUserId(userId);
    }

    public Template assignCategoryToTemplate(Long templateId, Long categoryId) {
        Template template = templateRepository.findById(templateId).orElse(null);
        Category category = categoryService.getCategoryById(categoryId);

        if (template != null && category != null) {
            if (template.getCategory() != null) {
                System.out.println("Template already has a category.");
                return null;
            } else {
                template.setCategory(category);
                return templateRepository.save(template);
            }
        } else {
            System.out.println("Error");
            return null;
        }
    }


    }





