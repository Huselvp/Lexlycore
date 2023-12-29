package com.iker.Lexly.service;

import com.iker.Lexly.DTO.TemplateDTO;
import com.iker.Lexly.Entity.Category;
import com.iker.Lexly.Entity.Documents;
import com.iker.Lexly.Entity.Template;
import com.iker.Lexly.Entity.User;
import com.iker.Lexly.Transformer.CategoryTransformer;
import com.iker.Lexly.Transformer.TemplateTransformer;
import com.iker.Lexly.repository.*;
import com.iker.Lexly.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TemplateService {
    private final TemplateRepository templateRepository;
    private final DocumentQuestionValueRepository documentQuestionValueRepository;
    private final CategoryRepository categoryRepository;

    private final CategoryService categoryService;
    private final UserRepository userRepository;
    private  final DocumentsRepository documentsRepository;
    private final QuestionRepository questionRepository;
    private final TemplateTransformer templateTransformer;
    private final CategoryTransformer categoryTransformer;

    @Autowired
    public TemplateService(UserRepository userRepository,DocumentsRepository documentsRepository,DocumentQuestionValueRepository documentQuestionValueRepository,CategoryTransformer categoryTransformer,TemplateTransformer templateTransformer,CategoryService categoryService,QuestionRepository questionRepository,CategoryRepository categoryRepository, TemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
        this.templateTransformer=templateTransformer;
        this.categoryRepository = categoryRepository;
        this.documentsRepository=documentsRepository;
        this.userRepository=userRepository;
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
    public Template createTemplate(TemplateDTO templateDTO, Long userId) {
        User user = userRepository.findById(Math.toIntExact(userId)).orElse(null);

        if (user != null) {
            Template template = Template.builder()
                    .templateName(templateDTO.getTemplateName())
                    .templateDescription(templateDTO.getTemplateDescription())
                    .cost(templateDTO.getCost())
                    .category(templateDTO.getCategory())
                    .user(user)
                    .build();
            return templateRepository.save(template);
        } else {
            System.out.println("null");
            return null;
        }
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
    public void deleteTemplate(Long id) {

        Optional<Template> templateOptional = templateRepository.findById(id);
        if (templateOptional.isPresent()) {
            Template template = templateOptional.get();
            List<Documents> documents = template.getDocuments();
            documentsRepository.deleteAll(documents);
            templateRepository.deleteById(id);
        }
    }
    public List<Template> getTemplatesByCategoryId(Long categoryId) {
        return templateRepository.findByCategoryId(categoryId);
    }

    public int getNumberOfTemplatesByCategoryId(Long categoryId) {
        List<Template> templates = templateRepository.findByCategoryId(categoryId);
        return templates.size();
    }



}






