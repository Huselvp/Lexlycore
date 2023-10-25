package com.iker.Lexly.service;

import com.iker.Lexly.DTO.DocumentsDTO;
import com.iker.Lexly.Entity.Documents;
import com.iker.Lexly.Entity.Template;
import com.iker.Lexly.Entity.User;
import com.iker.Lexly.repository.DocumentsRepository;
import com.iker.Lexly.repository.TemplateRepository;
import com.iker.Lexly.repository.UserRepository;
import com.iker.Lexly.request.DocumentCreateRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.stream.Collectors;

@Service
public class DocumentsService {
    private final DocumentsRepository documentsRepository;
    private final UserRepository userRepository;
    private final TemplateRepository templateRepository;



    @Autowired
    public DocumentsService(TemplateRepository templateRepository, UserRepository userRepository, DocumentsRepository documentsRepository) {
        this.userRepository=userRepository;
        this.templateRepository=templateRepository;
        this.documentsRepository = documentsRepository;

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

}