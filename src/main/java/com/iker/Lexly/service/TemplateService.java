package com.iker.Lexly.service;

import com.iker.Lexly.DTO.DocumentQuestionValueDTO;
import com.iker.Lexly.DTO.TemplateDTO;
import com.iker.Lexly.Entity.Category;
import com.iker.Lexly.Entity.DocumentQuestionValue;
import com.iker.Lexly.Entity.Template;
import com.iker.Lexly.Transformer.CategoryTransformer;
import com.iker.Lexly.Transformer.TemplateTransformer;
import com.iker.Lexly.repository.CategoryRepository;
import com.iker.Lexly.repository.DocumentQuestionValueRepository;
import com.iker.Lexly.repository.QuestionRepository;
import com.iker.Lexly.repository.TemplateRepository;
import com.iker.Lexly.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TemplateService {
    private final TemplateRepository templateRepository;
    private final DocumentQuestionValueRepository documentQuestionValueRepository;
    private final CategoryRepository categoryRepository;
    @Autowired
    private final CategoryService categoryService;
    private final QuestionRepository questionRepository;
    private final TemplateTransformer templateTransformer;
    private final CategoryTransformer categoryTransformer;

    @Autowired
    public TemplateService(DocumentQuestionValueRepository documentQuestionValueRepository,CategoryTransformer categoryTransformer,TemplateTransformer templateTransformer,CategoryService categoryService,QuestionRepository questionRepository,CategoryRepository categoryRepository, TemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
        this.templateTransformer=templateTransformer;
        this.categoryRepository = categoryRepository;
        this.categoryService=categoryService;
        this.categoryTransformer=categoryTransformer;
        this.questionRepository=questionRepository;
        this.documentQuestionValueRepository=documentQuestionValueRepository;
    }

    public List<Template> getAllTemplates() {
        return templateRepository.findAll();
    }

    public Template getTemplateById(Long templateId) {
        return templateRepository.findById(templateId)
                .orElse(null);
    }
    public TemplateDTO getTemplateDTOById(Long templateId) {
        Template template = templateRepository.findById(templateId).orElse(null);
        if (template != null) {
            return templateTransformer.toDTO(template);
        }
        return null;
    }
    public void deleteTemplatesByCategoryId(Long categoryId) {
        List<Template> templates = templateRepository.findByCategoryId(categoryId);
        for (Template template : templates) {
            deleteTemplate(template.getId());
        }
    }
    public void deleteTemplate(Long templateId) {
        // Manually delete associated template_question_value records
        DocumentQuestionValueRepository.deleteByTemplateId(templateId);
        templateRepository.deleteById(templateId);
    }
    public Template createTemplate(Template template) {
        return templateRepository.save(template);
    }
    public List<Template> getAllTemplatesByUserId(Long userId) {
        return templateRepository.findByUserId(userId);
    }
    public ApiResponse updateCategoryForTemplate(Long templateId, Long newCategoryId) {
        Template template = templateRepository.findById(templateId).orElse(null);
        Category newCategory = categoryService.getCategoryById(newCategoryId);

        if (template != null && newCategory != null) {
            Category existingCategory = template.getCategory();
            if (existingCategory != null) {
                template.setCategory(newCategory);
                Template updatedTemplate = templateRepository.save(template);
                return new ApiResponse("Category updated successfully.", updatedTemplate.getCategory());
            } else {
                return new ApiResponse("Template does not have a category.", null);
            }
        } else {
            return new ApiResponse("Error", null);
        }
    }


    public ApiResponse assignCategoryToTemplate(Long templateId, Long categoryId) {
        Template template = templateRepository.findById(templateId).orElse(null);
        Category category = categoryService.getCategoryById(categoryId);

        if (template != null && category != null) {
            if (template.getCategory() != null) {
                return new ApiResponse("Template already has a category.", template.getCategory());
            } else {
                template.setCategory(category);
                Template updatedTemplate = templateRepository.save(template);
                return new ApiResponse("Category assigned successfully.", updatedTemplate.getCategory());
            }
        } else {
            return new ApiResponse("Error", null);
        }
    }
    public Template updateTemplate(Long templateId, TemplateDTO templateDTO) {
        Optional<Template> existingTemplateOptional = templateRepository.findById(templateId);
        if (existingTemplateOptional.isPresent()) {
            Template existingTemplate = existingTemplateOptional.get();
            existingTemplate.setTemplateName(templateDTO.getTemplateName());
            existingTemplate.setTemplateDescription(templateDTO.getTemplateDescription());
            existingTemplate.setCost(templateDTO.getCost());

            return templateRepository.save(existingTemplate);
        } else {
            return null;
        }
    }


}






