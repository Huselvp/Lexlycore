package com.iker.Lexly.service;

import com.iker.Lexly.DTO.DocumentsDTO;
import com.iker.Lexly.Entity.*;
import com.iker.Lexly.repository.*;
import com.iker.Lexly.request.DocumentCreateRequest;
import com.iker.Lexly.responses.ApiResponse;
import com.iker.Lexly.responses.ApiResponseDocuments;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DocumentsService {
    private final DocumentsRepository documentsRepository;
    private final UserRepository userRepository;
    private final TemplateRepository templateRepository;
    private  final QuestionRepository questionRepository;
    private  final DocumentQuestionValueRepository documentQuestionValueRepository;
    @Autowired
    public DocumentsService(DocumentQuestionValueRepository documentQuestionValueRepository,QuestionRepository questionRepository,TemplateRepository templateRepository, UserRepository userRepository, DocumentsRepository documentsRepository) {
        this.userRepository=userRepository;
        this.questionRepository=questionRepository;
        this.templateRepository=templateRepository;
        this.documentsRepository = documentsRepository;
        this.documentQuestionValueRepository=documentQuestionValueRepository;

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
        // dto.setDraft(documents.isDraft());
        // Set other fields
        return dto;
    }
    public DocumentsDTO createDocument(DocumentCreateRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + request.getUserId()));

        Template template = templateRepository.findById(request.getTemplateId())
                .orElseThrow(() -> new IllegalArgumentException("Template not found with ID: " + request.getTemplateId()));

        Documents document = new Documents();
        document.setUser(user);
        document.setTemplate(template);
        document.setCreatedAt(request.getCreatedAt());
        document.setDraft(request.isDraft());
        document = documentsRepository.save(document);
        DocumentsDTO documentDTO = new DocumentsDTO();
        documentDTO.setId(document.getId());
        documentDTO.setCreatedAt(document.getCreatedAt());
        documentDTO.setDraft(document.getDraft());
        return documentDTO;
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
        // Check if the document and question exist
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
}