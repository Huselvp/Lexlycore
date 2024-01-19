package com.iker.Lexly.service;

import com.iker.Lexly.DTO.DocumentQuestionValueDTO;
import com.iker.Lexly.DTO.DocumentsDTO;
import com.iker.Lexly.Entity.*;
import com.iker.Lexly.config.jwt.JwtService;
import com.iker.Lexly.repository.*;
import com.iker.Lexly.request.AddValuesRequest;
import com.iker.Lexly.request.UpdateValuesRequest;
import com.iker.Lexly.responses.ApiResponse;
import com.iker.Lexly.responses.ApiResponseDocuments;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.xhtmlrenderer.pdf.ITextRenderer;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DocumentsService {
    private final DocumentsRepository documentsRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final TemplateRepository templateRepository;
    private final QuestionRepository questionRepository;
    private final DocumentQuestionValueRepository documentQuestionValueRepository;

    @Autowired
    public DocumentsService(DocumentQuestionValueRepository documentQuestionValueRepository, QuestionRepository questionRepository, TemplateRepository templateRepository, UserRepository userRepository, DocumentsRepository documentsRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
        this.templateRepository = templateRepository;
        this.documentsRepository = documentsRepository;
        this.documentQuestionValueRepository = documentQuestionValueRepository;

        this.jwtService = jwtService;
    }

    public Documents createOrUpdateDocument(Documents document) {
        return documentsRepository.save(document);
    }

    public List<Documents> getDocumentsByUser(User user) {
        return documentsRepository.findByUser(user);
    }

    public Documents getDocumentById(Long id) {
        return documentsRepository.findById(id).orElse(null);
    }

    public List<Documents> getAllDocumentsByUser(User user) {
        return documentsRepository.findByUser(user);
    }

    public List<Documents> getDocumentsByUserId(String token) {
        if (jwtService.isTokenExpired(token)) {
            return Collections.emptyList();
        }
        String username = jwtService.extractUsername(token);
        User user = userRepository.findByUsername(username).orElse(null);
        if (user != null) {
            Long userId = user.getId();
            List<Documents> documents = documentsRepository.findByUserId(userId);
            return new ArrayList<>(documents);
        } else {
            return Collections.emptyList();
        }
    }


    public ApiResponseDocuments createNewDocument(Long templateId, Long userId) {
        Template template = templateRepository.findById(templateId).orElse(null);

        if (template != null) {
            User user = userRepository.findById(Math.toIntExact(userId)).orElse(null);
            if (user != null) {
                Documents document = new Documents();
                document.setTemplate(template);
                document.setCreatedAt(LocalDateTime.now());
                document.setDraft(true);
                document.setUser(user);
                Documents savedDocument = documentsRepository.save(document);
                return new ApiResponseDocuments("Document created successfully.", savedDocument.getId());
            } else {
                return new ApiResponseDocuments("User not found.", null);
            }
        } else {
            return new ApiResponseDocuments("Template not found.", null);
        }
    }

    public ApiResponseDocuments createNewDocument(Long templateId) {
        Template template = templateRepository.findById(templateId).orElse(null);
        if (template != null) {
            Documents document = new Documents();
            document.setTemplate(template);
            document.setCreatedAt(LocalDateTime.now());
            document.setDraft(true);
            Documents savedDocument = documentsRepository.save(document);
            return new ApiResponseDocuments("Document created successfully.", savedDocument.getId());
        } else {
            return new ApiResponseDocuments("Template not found.", null);
        }
    }

    public ApiResponse saveTemporaryValue(Long documentId, Long questionId, String value) {
        Documents document = documentsRepository.findById(documentId).orElse(null);
        Question question = questionRepository.findById(questionId).orElse(null);

        if (document != null && question != null) {
            DocumentQuestionValue existingValue = documentQuestionValueRepository.findByDocumentAndQuestion(document, question);
            if (existingValue != null) {
                existingValue.setValue(value);
            } else {
                DocumentQuestionValue newValue = new DocumentQuestionValue();
                newValue.setDocument(document);
                newValue.setQuestion(question);
                newValue.setValue(value);
                documentQuestionValueRepository.save(newValue);
            }

            return new ApiResponse("Temporary value saved successfully.", null);
        } else {
            return new ApiResponse("Document or question not found.", null);
        }
    }


    public ApiResponse completeDocument(Long documentId) {
        Documents document = documentsRepository.findById(documentId).orElse(null);

        if (document != null) {
            List<Question> templateQuestions = document.getTemplate().getQuestions();
            List<DocumentQuestionValue> documentValues = document.getDocumentQuestionValues();
            if (documentValues.size() == templateQuestions.size()) {
                document.setDraft(false);
                documentsRepository.save(document);
                return new ApiResponse("Document completed successfully.", null);
            } else {
                return new ApiResponse("All questions must have values to complete the document.", null);
            }
        } else {
            return new ApiResponse("Document not found.", null);
        }
    }


    public String documentProcess(List<Question> questions, Long documentId, Long templateId, List<DocumentQuestionValue> documentQuestionValues) {
        if (!isExist(documentId, documentQuestionValues)) {
            return "Invalid documentId or document not found.";
        }
        Document mainDocument = Jsoup.parse("<div></div>");
        for (Question question : questions) {
            if (question.getTemplate().getId().equals(templateId)) {
                String text = question.getTexte();
                text = replaceValues(text, question.getId(), documentQuestionValues);
                Document questionDocument = Jsoup.parseBodyFragment(text);
                for (org.jsoup.nodes.Node child : questionDocument.body().childNodes()) {
                    mainDocument.body().appendChild(child.clone());
                }
            }
        }

        return mainDocument.html().trim();
    }


    private boolean isExist(Long documentId, List<DocumentQuestionValue> documentQuestionValues) {
        return documentQuestionValues.stream().anyMatch(dqv -> dqv.getDocument().getId().equals(documentId));
    }

    private String replaceValues(String text, Long questionId, List<DocumentQuestionValue> documentQuestionValues) {
        for (DocumentQuestionValue documentQuestionValue : documentQuestionValues) {
            if (documentQuestionValue.getQuestion().getId().equals(questionId)) {
                if (documentQuestionValue.getValue() != null) {
                    text = text.replace("[value]", documentQuestionValue.getValue());
                } else {
                    text = text.replace("[value]", "null");
                }
                break;
            }
        }
        return text;
    }

    public byte[] generatePdfFromHtml(String html, ByteArrayOutputStream outputStream) {
        try {
            // Ensure HTML is well-formed
            String wellFormedXml = "<div>" + html + "</div>";

            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(wellFormedXml);
            renderer.layout();
            renderer.createPDF(outputStream);
            renderer.finishPDF();

            return outputStream.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            return new byte[0];
        }
    }
    public Documents updatePaymentStatus(Long documentId) {
        Documents document = documentsRepository.findById(documentId)
                .orElseThrow(() -> new NotFoundException("Document not found"));

        document.setPaymentStatus(true);
        return documentsRepository.save(document);
    }

    public ApiResponse addValues(AddValuesRequest request) {
        Long documentId = request.getDocumentId();
        List<DocumentQuestionValueDTO> values = request.getValues();
        Documents document = documentsRepository.findById(documentId).orElse(null);
        if (document != null) {
            for (DocumentQuestionValueDTO valueDto : values) {
                Long questionId = valueDto.getQuestionId();
                String value = valueDto.getValue();
                DocumentQuestionValue existingValue = documentQuestionValueRepository.findByDocumentIdAndQuestionId(questionId, documentId);
                if (existingValue != null) {
                    return new ApiResponse("A value already exists for this question and document combination.", null);
                }
                Question question = questionRepository.findById(questionId).orElse(null);

                if (question != null) {
                    DocumentQuestionValue documentQuestionValue = new DocumentQuestionValue(question, document, value);
                    documentQuestionValueRepository.save(documentQuestionValue);
                } else {
                    return new ApiResponse("Question not found.", null);
                }
            }
            return new ApiResponse("Values added successfully.", null);
        } else {
            return new ApiResponse("Document not found.", null);
        }
    }
    public ApiResponse updateValues(UpdateValuesRequest request) {
        Long documentId = request.getDocumentId();
        List<DocumentQuestionValueDTO> values = request.getValues();
        Documents document = documentsRepository.findById(documentId).orElse(null);

        if (document != null) {
            for (DocumentQuestionValueDTO valueDto : values) {
                Long questionId = valueDto.getQuestionId();
                String updatedValue = valueDto.getValue();
                DocumentQuestionValue existingValue = documentQuestionValueRepository.findByDocumentIdAndQuestionId(questionId, documentId);
                if (existingValue != null) {
                    existingValue.setValue(updatedValue);
                    documentQuestionValueRepository.save(existingValue);
                } else {
                    return new ApiResponse("Value not found for the given question and document combination.", null);
                }
            }
            return new ApiResponse("Values updated successfully.", null);
        } else {
            return new ApiResponse("Document not found.", null);
        }
    }
}




