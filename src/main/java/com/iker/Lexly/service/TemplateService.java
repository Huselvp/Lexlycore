package com.iker.Lexly.service;

import com.iker.Lexly.DTO.SubcategoryDTO;
import com.iker.Lexly.DTO.TemplateDTO;
import com.iker.Lexly.Entity.Documents;
import com.iker.Lexly.Entity.Subcategory;
import com.iker.Lexly.Entity.Template;
import com.iker.Lexly.Entity.User;
import com.iker.Lexly.Transformer.SubCategoryTransformer;
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
    private final SubcategoryService subcategoryService;
    private final SubCategoryTransformer subCategoryTransformer;
    private final SubcategoryRepository subcategoryRepository;
    private final DocumentQuestionValueRepository documentQuestionValueRepository;
    private final UserRepository userRepository;
    private  final DocumentsRepository documentsRepository;
    private final QuestionRepository questionRepository;
    private final JwtService jwtService;
    private final TemplateTransformer templateTransformer;

    @Autowired
    public TemplateService(SubcategoryRepository subcategoryRepository,SubCategoryTransformer subCategoryTransformer,SubcategoryService subcategoryService,JwtService jwtService,UserRepository userRepository,DocumentsRepository documentsRepository,DocumentQuestionValueRepository documentQuestionValueRepository,TemplateTransformer templateTransformer,QuestionRepository questionRepository, TemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
        this.templateTransformer=templateTransformer;
        this.documentsRepository=documentsRepository;
        this.jwtService=jwtService;
        this.subcategoryRepository=subcategoryRepository;
        this.subCategoryTransformer=subCategoryTransformer;
        this.subcategoryService=subcategoryService;
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
    public ApiResponse updateCategoryForTemplate( Long templateId , Long newSubcategoryId){
        Template template = templateRepository.findById(templateId).orElse(null);
        if(template != null && template.getSubcategory() !=null){
            SubcategoryDTO subcategoryDTO = subcategoryService.getSubcategoryById(newSubcategoryId);
            template.setSubcategory(subCategoryTransformer.toEntity(subcategoryDTO));
            return  new ApiResponse("SubCategory is updated" ,template );
          }
        else {
            return new ApiResponse("template or subcategory is null", null);
        }
    }
public ApiResponse assignSubcategoryToTemplate(Long templateId, Long subcategoryId) {
    Template template = templateRepository.findById(templateId).orElse(null);
    SubcategoryDTO subcategory = subcategoryService.getSubcategoryById(subcategoryId);

    if (template != null && subcategory != null) {
        if (template.getSubcategory() != null) {
            return new ApiResponse("Template already has a subcategory.", template.getSubcategory());
        } else {
            template.setSubcategory(subCategoryTransformer.toEntity(subcategory));
            Template updatedTemplate = templateRepository.save(template);
            return new ApiResponse("Subcategory assigned successfully.", updatedTemplate.getSubcategory());
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
            existingTemplate.setContent(templateDTO.getContent());
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






