package com.iker.Lexly.Controller;

import com.iker.Lexly.DTO.QuestionDTO;
import com.iker.Lexly.Transformer.QuestionTransformer;
import com.iker.Lexly.responses.ApiResponse;
import com.iker.Lexly.DTO.DocumentQuestionValueDTO;
import com.iker.Lexly.DTO.DocumentsDTO;
import com.iker.Lexly.DTO.TemplateDTO;
import com.iker.Lexly.Entity.*;
import com.iker.Lexly.Transformer.TemplateTransformer;
import com.iker.Lexly.repository.DocumentsRepository;
import com.iker.Lexly.repository.TemplateRepository;
import com.iker.Lexly.responses.ApiResponseDocuments;
import com.iker.Lexly.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/suser")
public class suserController {

    private final DocumentsService documentsService;
    private final TemplateService templateService;
    private final QuestionService questionService;
    private final TemplateTransformer templateTransformer;
    private final QuestionTransformer questionTransformer;


    @Autowired
    public suserController(QuestionTransformer questionTransformer,DocumentsService documentsService, TemplateTransformer templateTransformer, TemplateService templateService, QuestionService questionService) {
        this.templateTransformer = templateTransformer;
        this.questionTransformer = questionTransformer;
        this.documentsService = documentsService;
        this.questionService = questionService;
        this.templateService = templateService;

    }
    @GetMapping("/user_all_templates")
    public List<TemplateDTO> getAllTemplates() {
        List<Template> templates = templateService.getAllTemplates();
        List<TemplateDTO> templateDTOs = templates.stream()
                .map(templateTransformer::toDTO)
                .collect(Collectors.toList());
        return templateDTOs;
    }
    @GetMapping("/get_documents/{userId}")
    public List<DocumentsDTO> getDocumentsByUserId(@PathVariable String userId) {
        return documentsService.getDocumentsByUserId(Long.valueOf(userId));
    }
    @GetMapping("/user_template/{templateId}")
    public ResponseEntity<Template> getTemplateById(@PathVariable Long templateId) {
        Template template = templateService.getTemplateById(templateId);

        if (template != null) {
            return new ResponseEntity<>(template, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @PostMapping("/createDocument/{templateId}")
    public ApiResponseDocuments createNewDocument(@PathVariable Long templateId) {
        ApiResponseDocuments response = documentsService.createNewDocument(templateId);
        return response;
    }
    @GetMapping("/all_questions_by_template/{templateId}")
    public List<QuestionDTO> findQuestionsByTemplateId(@PathVariable Long templateId) {
        List<Question> questions = questionService.findQuestionsByTemplateId(templateId);
        List<QuestionDTO> questionDTOs = questions.stream()
                .map(questionTransformer::toDTO)
                .collect(Collectors.toList());
        return questionDTOs;
    }
    @PostMapping("/saveTemporaryValue")
    public ApiResponse saveTemporaryValue(
            @RequestParam Long documentId,
            @RequestParam Long questionId,
            @RequestParam String value
    ) {
        ApiResponse response = documentsService.saveTemporaryValue(documentId, questionId, value);
        return response;
    }

    @PostMapping("/addValue")
    public ResponseEntity<DocumentQuestionValueDTO> addValueToQuestion(
            @RequestBody DocumentQuestionValueDTO documentQuestionValueDTO) {
        DocumentQuestionValueDTO documentQuestionValue = questionService.addValueToQuestion(
                documentQuestionValueDTO.getQuestionId(),
                documentQuestionValueDTO.getDocumentId(),
                documentQuestionValueDTO.getValue()
        );
        return new ResponseEntity<>(documentQuestionValue, HttpStatus.CREATED);
    }

    @GetMapping("/values/{documentId}")
    public ResponseEntity<List<DocumentQuestionValue>> getValuesForDocument(@PathVariable Long documentId) {
        List<DocumentQuestionValue> values = questionService.getValuesForDocument(documentId);
        return new ResponseEntity<>(values, HttpStatus.OK);
    }
}


