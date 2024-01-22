package com.iker.Lexly.Controller;
import com.iker.Lexly.Transformer.QuestionTransformer;
import com.iker.Lexly.config.jwt.JwtService;
import com.iker.Lexly.repository.DocumentQuestionValueRepository;
import com.iker.Lexly.repository.DocumentsRepository;
import com.iker.Lexly.repository.QuestionRepository;
import com.iker.Lexly.repository.UserRepository;
import com.iker.Lexly.request.AddValuesRequest;
import com.iker.Lexly.request.RequestData;
import com.iker.Lexly.DTO.TemplateDTO;
import com.iker.Lexly.Entity.*;
import com.iker.Lexly.Transformer.TemplateTransformer;
import com.iker.Lexly.request.UpdateValuesRequest;
import com.iker.Lexly.responses.ApiResponse;
import com.iker.Lexly.responses.ApiResponseDocuments;
import com.iker.Lexly.service.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.io.ByteArrayOutputStream;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
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
    private final JwtService jwtService;
    private  final DocumentsRepository documentsRepository;
    private final QuestionTransformer questionTransformer;
    private final PDFGenerationService pdfGenerationService;
    private final UserRepository userRepository;

    @Autowired
    public suserController(UserRepository userRepository, JwtService jwtService, DocumentQuestionValueService documentQuestionValueService, DocumentQuestionValueRepository documentQuestionValueRepository, QuestionRepository questionRepository, PDFGenerationService pdfGenerationService, QuestionTransformer questionTransformer, DocumentsService documentsService, TemplateTransformer templateTransformer, TemplateService templateService, QuestionService questionService, DocumentsRepository documentsRepository) {
        this.templateTransformer = templateTransformer;
        this.documentQuestionValueService = documentQuestionValueService;
        this.documentQuestionValueRepository = documentQuestionValueRepository;
        this.questionRepository = questionRepository;
        this.userRepository=userRepository;
        this.questionTransformer = questionTransformer;
        this.pdfGenerationService = pdfGenerationService;
        this.documentsService = documentsService;
        this.jwtService= jwtService;
        this.questionService = questionService;
        this.templateService = templateService;
        this.documentsRepository = documentsRepository;
    }
    @GetMapping("/get_documents/{token}")
    public ResponseEntity<List<Documents>> getDocumentsByToken(@PathVariable String token) {
        List<Documents> documents = documentsService.getDocumentsByUserId(token);
        if (!documents.isEmpty()) {
            return ResponseEntity.ok(documents);
        } else {
            return ResponseEntity.ok(Collections.emptyList());
        }
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
    private String extractTokenFromRequest(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7);
        }
        return null;
    }
    @PostMapping("/createDocument/{templateId}")
    public ApiResponseDocuments createNewDocument(@PathVariable Long templateId, HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        String username = jwtService.extractUsername(token);
        Optional<User> user = userRepository.findByUsername(username);
        if (user != null) {
            Long userId = user.get().getUserId();
            ApiResponseDocuments response = documentsService.createNewDocument(templateId, userId);
            return response;
        } else {
            return new ApiResponseDocuments("User not found.", null);
        }
    }
    @GetMapping("/suser_find_questions_by_template/{templateId}")
    public List<Question> findQuestionsByTemplateId(@PathVariable Long templateId) {
        List<Question> questionDTOs = questionRepository.findByTemplateId(templateId);
        return questionDTOs;
    }

    @PostMapping("/addValues")
    public ApiResponse addValues(@RequestBody AddValuesRequest request) {
        ApiResponse response = documentsService.addOrUpdateValues(request);
        return response;
    }

    @GetMapping("/values/{documentId}")
    public ResponseEntity<List<DocumentQuestionValue>> getValuesForDocument(@PathVariable Long documentId) {
        List<DocumentQuestionValue> values =documentsService.getValuesByDocumentId(documentId);
        return new ResponseEntity<>(values, HttpStatus.OK);
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
        try {
            Documents document = documentsRepository.findById(documentId)
                    .orElseThrow(() -> new RuntimeException("Document not found"));
            if (document.isPaymentStatus()) {
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
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Payment not completed. Cannot generate PDF.".getBytes());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(("Error: " + e.getMessage()).getBytes());
        }
    }
}


