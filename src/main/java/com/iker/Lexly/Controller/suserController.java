package com.iker.Lexly.Controller;

import com.iker.Lexly.DTO.QuestionDTO;
import com.iker.Lexly.Transformer.QuestionTransformer;
import com.iker.Lexly.repository.DocumentQuestionValueRepository;
import com.iker.Lexly.repository.QuestionRepository;
import com.iker.Lexly.request.RequestData;
import com.iker.Lexly.request.UpdateValueRequest;
import com.iker.Lexly.DTO.DocumentsDTO;
import com.iker.Lexly.DTO.TemplateDTO;
import com.iker.Lexly.Entity.*;
import com.iker.Lexly.Transformer.TemplateTransformer;
import com.iker.Lexly.responses.ApiResponse;
import com.iker.Lexly.responses.ApiResponseDocuments;
import com.iker.Lexly.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/suser")
public class suserController {

    private final DocumentsService documentsService;
    private final TemplateService templateService;
    private final QuestionService questionService;
    private final TemplateTransformer templateTransformer;
    private final QuestionRepository questionRepository;
    private final DocumentQuestionValueRepository documentQuestionValueRepository;
    private final QuestionTransformer questionTransformer;
private final PDFGenerationService pdfGenerationService;

    @Autowired
    public suserController(DocumentQuestionValueRepository documentQuestionValueRepository,QuestionRepository questionRepository,PDFGenerationService pdfGenerationService,QuestionTransformer questionTransformer,DocumentsService documentsService, TemplateTransformer templateTransformer, TemplateService templateService, QuestionService questionService) {
        this.templateTransformer = templateTransformer;
        this.documentQuestionValueRepository=documentQuestionValueRepository;
        this.questionRepository=questionRepository;
        this.questionTransformer = questionTransformer;
        this.pdfGenerationService=pdfGenerationService;
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
    @PostMapping("/saveTemporaryValues/{documentId}")
    public ApiResponse saveTemporaryValues(
            @PathVariable   Long documentId,
            @RequestBody List<Long> questionIds,
            @RequestBody List<String> values
    ) {
        if (questionIds.size() != values.size()) {
            return new ApiResponse("Mismatched question IDs and values.", null);
        }

        for (int i = 0; i < questionIds.size(); i++) {
            Long questionId = questionIds.get(i);
            String value = values.get(i);
            ApiResponse response = documentsService.saveTemporaryValue(documentId, questionId, value);
            if (!response.isSuccess()) {
                return response;
            }
        }
        return new ApiResponse("Temporary values saved successfully.", null);
    }
    @PutMapping("/updateValue")
    public ApiResponse updateValue(@RequestBody UpdateValueRequest request) {
        ApiResponse response = documentsService.updateValueandSave(request);
        return response;
    }


    @PostMapping("/completeDocument/{documentId}")
    public ApiResponse completeDocument(@PathVariable Long documentId) {
        ApiResponse response = documentsService.completeDocument(documentId);
        return response;
    }
    @GetMapping("/values/{documentId}")
    public ResponseEntity<List<DocumentQuestionValue>> getValuesForDocument(@PathVariable Long documentId) {
        List<DocumentQuestionValue> values = questionService.getValuesForDocument(documentId);
        return new ResponseEntity<>(values, HttpStatus.OK);
    }

    @GetMapping("/generate-pdf")
    public ResponseEntity<String> generatePdf(@RequestParam Long documentId, @RequestParam Long templateId) {
        List<Question> questions = questionRepository.findByTemplateId(templateId);
        List<DocumentQuestionValue> documentQuestionValues =documentQuestionValueRepository.findByDocumentId(documentId);
        String concatenatedText = documentsService.DocumentProcess(questions, documentId, templateId, documentQuestionValues);
        String outputFilePath = "document.pdf";
        documentsService.generatePdfFromText(concatenatedText, outputFilePath);
        return ResponseEntity.ok("PDF generated successfully");
    }
    @GetMapping("/test")
    public ResponseEntity<String> testDocumentProcess(@RequestBody RequestData requestData) {
        Long documentId = requestData.getDocumentId();
        Long templateId = requestData.getTemplateId();
        System.out.println("id doc"+requestData.getDocumentId());
        System.out.println("id template"+requestData.getTemplateId());
        List<Question> questions = questionRepository.findByTemplateId(templateId);
        List<DocumentQuestionValue> documentQuestionValues = documentQuestionValueRepository.findByDocumentId(documentId);
        String concatenatedText = documentsService.DocumentProcess(questions, documentId, templateId, documentQuestionValues);
        System.out.println("Concatenated Text: " + concatenatedText);
        return ResponseEntity.ok(concatenatedText);
    }


}


