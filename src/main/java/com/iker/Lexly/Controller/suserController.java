package com.iker.Lexly.Controller;
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
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api/suser")
@PreAuthorize("hasRole('ROLE_SUSER')")
public class suserController {
    private final DocumentsService documentsService;
    private final TemplateService templateService;
    private final QuestionService questionService;
    private final TemplateTransformer templateTransformer;
    private final QuestionRepository questionRepository;
    private final DocumentQuestionValueRepository documentQuestionValueRepository;
    private final DocumentQuestionValueService documentQuestionValueService;
    private final QuestionTransformer questionTransformer;
    private final PDFGenerationService pdfGenerationService;
    @Autowired
    public suserController(DocumentQuestionValueService documentQuestionValueService, DocumentQuestionValueRepository documentQuestionValueRepository, QuestionRepository questionRepository, PDFGenerationService pdfGenerationService, QuestionTransformer questionTransformer, DocumentsService documentsService, TemplateTransformer templateTransformer, TemplateService templateService, QuestionService questionService) {
        this.templateTransformer = templateTransformer;
        this.documentQuestionValueService = documentQuestionValueService;
        this.documentQuestionValueRepository = documentQuestionValueRepository;
        this.questionRepository = questionRepository;
        this.questionTransformer = questionTransformer;
        this.pdfGenerationService = pdfGenerationService;
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
    @GetMapping("/find_questions_by_template/{templateId}")
    public List<Question> findQuestionsByTemplateId(@PathVariable Long templateId) {
        List<Question> questionDTOs = questionRepository.findByTemplateId(templateId);
        return questionDTOs;
    }

    @PostMapping("/saveTemporaryValues/{documentId}")
    public ApiResponse saveTemporaryValues(
            @PathVariable Long documentId,
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
    @PatchMapping("/updateValue")
    public ApiResponse updateValue(@RequestBody UpdateValueRequest request) {
        ApiResponse response = documentsService.addOrUpdateValue(request);
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
    @GetMapping("/values/{documentId}/{questionId}")
    public ResponseEntity<DocumentQuestionValue> getValueForDocumentAndQuestion(
            @PathVariable Long documentId,
            @PathVariable Long questionId) {
        DocumentQuestionValue value = questionService.getValueForDocumentAndQuestion(documentId, questionId);

        if (value != null) {
            return new ResponseEntity<>(value, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> testDocumentProcess(@RequestBody RequestData requestData) {
        Long documentId = requestData.getDocumentId();
        Long templateId = requestData.getTemplateId();
        List<Question> questions = questionRepository.findByTemplateId(templateId);
        List<DocumentQuestionValue> documentQuestionValues = documentQuestionValueRepository.findByDocumentId(documentId);
        String concatenatedText = documentsService.documentProcess(questions, documentId, templateId, documentQuestionValues);
        System.out.println("Concatenated Text: " + concatenatedText);
        return ResponseEntity.ok(concatenatedText);
    }
    @GetMapping("/generate-pdf/{documentId}/{templateId}")
    public ResponseEntity<byte[]> generatePdf(
            @PathVariable Long documentId,
            @PathVariable Long templateId,
            @RequestParam(required = false) String htmlContent) {
        if (htmlContent == null) {
            List<Question> questions = questionRepository.findByTemplateId(templateId);
            List<DocumentQuestionValue> documentQuestionValues = documentQuestionValueRepository.findByDocumentId(documentId);
            String concatenatedText = documentsService.documentProcess(questions, documentId, templateId, documentQuestionValues);
            concatenatedText = concatenatedText.replaceAll("<br\\s*/?>", "<br></br>");
            htmlContent = "<html><head></head><body>" + concatenatedText + "</body></html>";
        }
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            byte[] pdfContent = documentsService.generatePdfFromHtml(htmlContent, outputStream);
            if (pdfContent.length > 0) {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_PDF);
                headers.setContentDispositionFormData("attachment", "document_" + documentId + "_" + System.currentTimeMillis() + ".pdf");
                return new ResponseEntity<>(pdfContent, headers, HttpStatus.OK);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("PDF generation failed".getBytes());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(("Error generating PDF: " + e.getMessage()).getBytes());
        }
    }
}


