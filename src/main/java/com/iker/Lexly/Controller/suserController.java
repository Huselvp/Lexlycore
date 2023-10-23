package com.iker.Lexly.Controller;

import com.iker.Lexly.DTO.TemplateDTO;
import com.iker.Lexly.Entity.*;
import com.iker.Lexly.Transformer.TemplateTransformer;
import com.iker.Lexly.request.DocumentCreateRequest;
import com.iker.Lexly.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
public class suserController {
    private final DocumentsService documentsService;
    private final UserService userService;
    private final TemplateService templateService;
    private final QuestionService questionService;
    private final TemplateTransformer templateTransformer;



    @Autowired
    public suserController(DocumentsService documentsService,TemplateTransformer templateTransformer, UserService userService, TemplateService templateService, QuestionService questionService) {
        this.templateTransformer=templateTransformer;
        this.userService = userService;
        this.documentsService=documentsService;
        this.questionService = questionService;
        this.templateService = templateService;
    }
    @GetMapping("/all_templates")
    public List<TemplateDTO> getAllTemplates() {
        List<Template> templates = templateService.getAllTemplates();
        List<TemplateDTO> templateDTOs = templates.stream()
                .map(templateTransformer::toDTO)
                .collect(Collectors.toList());
        return templateDTOs;
    }
    @PostMapping("/create_document")
    public Documents createDocument(@RequestBody DocumentCreateRequest documentCreateRequest) {
        return documentsService.createDocument(documentCreateRequest);
    }
    @GetMapping("/get_documents/{userId}")
    public List<Documents> getDocumentsByUserId( @PathVariable String userId) {
        return documentsService.getDocumentsByUserId(Long.valueOf(userId));
    }
    @PostMapping("/addValue")
    public ResponseEntity<DocumentQuestionValue> addValueToQuestion(
            @RequestParam Long questionId,
            @RequestParam Long documentId,
            @RequestParam String value
    ) {
        DocumentQuestionValue documentQuestionValue = questionService.addValueToQuestion(questionId, documentId, value);
        return new ResponseEntity<>(documentQuestionValue, HttpStatus.CREATED);
    }

    @GetMapping("/values/{documentId}")
    public ResponseEntity<List<DocumentQuestionValue>> getValuesForDocument(@PathVariable Long documentId) {
        List<DocumentQuestionValue> values = questionService.getValuesForDocument(documentId);
        return new ResponseEntity<>(values, HttpStatus.OK);
    }

}


