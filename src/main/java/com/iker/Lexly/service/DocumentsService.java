package com.iker.Lexly.service;

import com.iker.Lexly.DTO.DocumentQuestionValueDTO;
import com.iker.Lexly.DTO.DocumentsDTO;
import com.iker.Lexly.Entity.*;
import com.iker.Lexly.repository.*;
import com.iker.Lexly.request.AddValuesRequest;
import com.iker.Lexly.request.DocumentCreateRequest;
import com.iker.Lexly.request.UpdateValueRequest;
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
import java.util.List;
import java.util.stream.Collectors;
@Service
@Transactional
public class DocumentsService {
    private final DocumentsRepository documentsRepository;
    private final UserRepository userRepository;
    private final TemplateRepository templateRepository;
    private final QuestionRepository questionRepository;
    private final DocumentQuestionValueRepository documentQuestionValueRepository;

    @Autowired
    public DocumentsService(DocumentQuestionValueRepository documentQuestionValueRepository, QuestionRepository questionRepository, TemplateRepository templateRepository, UserRepository userRepository, DocumentsRepository documentsRepository) {
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
        this.templateRepository = templateRepository;
        this.documentsRepository = documentsRepository;
        this.documentQuestionValueRepository = documentQuestionValueRepository;

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

    public List<DocumentsDTO> getDocumentsByUserId(Long userId) {
        List<Documents> documents = documentsRepository.findByUserId(userId);
        List<DocumentsDTO> documentDTOs = documents.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return documentDTOs;
    }

    private DocumentsDTO convertToDTO(Documents documents) {
        DocumentsDTO dto = new DocumentsDTO();
        dto.setId(documents.getId());
        dto.setCreatedAt(documents.getCreatedAt());
        dto.setDraft(documents.getDraft());
        return dto;
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

    public ApiResponse updateValue(UpdateValueRequest request) {
        Long documentId = request.getDocumentId();
        Long questionId = request.getQuestionId();
        String value = request.getValue();
        Documents document = documentsRepository.findById(documentId).orElse(null);
        Question question = questionRepository.findById(questionId).orElse(null);
        if (document != null && question != null) {
            DocumentQuestionValue existingValue = documentQuestionValueRepository.findByDocumentAndQuestion(document, question);
            if (existingValue != null) {
                existingValue.setValue(value);
                documentQuestionValueRepository.save(existingValue);
                return new ApiResponse("Value updated successfully.", null);
            } else {
                return new ApiResponse("Document and question combination not found.", null);
            }
        } else {
            return new ApiResponse("Document or question not found.", null);
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
            String wellFormedXml = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" " +
                    "\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">" +
                    "<html xmlns=\"http://www.w3.org/1999/xhtml\">" +
                    "<head></head><body><div>" + html + "</div></body></html>";
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
}




