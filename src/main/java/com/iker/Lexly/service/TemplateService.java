package com.iker.Lexly.service;

import com.iker.Lexly.DTO.TemplateDTO;
import com.iker.Lexly.Entity.Documents;
import com.iker.Lexly.Entity.Template;
import com.iker.Lexly.Entity.User;
import com.iker.Lexly.Transformer.TemplateTransformer;
import com.iker.Lexly.config.jwt.JwtService;
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
    private final UserRepository userRepository;
    private  final DocumentsRepository documentsRepository;
    private final QuestionRepository questionRepository;
    private final JwtService jwtService;
    private final TemplateTransformer templateTransformer;

    @Autowired
    public TemplateService(JwtService jwtService,UserRepository userRepository,DocumentsRepository documentsRepository,DocumentQuestionValueRepository documentQuestionValueRepository,TemplateTransformer templateTransformer,QuestionRepository questionRepository, TemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
        this.templateTransformer=templateTransformer;
        this.documentsRepository=documentsRepository;
        this.jwtService=jwtService;
        this.userRepository=userRepository;
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
    public ApiResponse createTemplate(String token, Template template) {
        String username = jwtService.extractUsername(token);
        User user = userRepository.findByUsername(username).orElse(null);
        if (user != null) {
            template.setUser(user);
            Template savedTemplate = templateRepository.save(template);
            if (savedTemplate != null) {
                return new ApiResponse("Template created successfully.", savedTemplate);
            } else {
                return new ApiResponse("Failed to create template.", null);
            }
        } else {
            return new ApiResponse("User not found.", null);
        }
    }
    public List<Template> getAllTemplatesByUserId(Long userId) {
        return templateRepository.findByUserId(userId);
    }
//    public ApiResponse updateCategoryForTemplate(Long templateId, Long newCategoryId) {
//        Template template = templateRepository.findById(templateId).orElse(null);
//        Category newCategory = categoryService.getCategoryById(newCategoryId);
//
//        if (template != null && newCategory != null) {
//            Category existingCategory = template.getCategory();
//            if (existingCategory != null) {
//                template.setCategory(newCategory);
//                Template updatedTemplate = templateRepository.save(template);
//                return new ApiResponse("Category updated successfully.", updatedTemplate.getCategory());
//            } else {
//                return new ApiResponse("Template does not have a category.", null);
//            }
//        } else {
//            return new ApiResponse("Error", null);
//        }
//    }
//    public ApiResponse assignCategoryToTemplate(Long templateId, Long categoryId) {
//        Template template = templateRepository.findById(templateId).orElse(null);
//        Category category = categoryService.getCategoryById(categoryId);
//
//        if (template != null && category != null) {
//            if (template.getCategory() != null) {
//                return new ApiResponse("Template already has a category.", template.getCategory());
//            } else {
//                template.setCategory(category);
//                Template updatedTemplate = templateRepository.save(template);
//                return new ApiResponse("Category assigned successfully.", updatedTemplate.getCategory());
//            }
//        } else {
//            return new ApiResponse("Error", null);
//        }
//    }
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




}






