package com.iker.Lexly.service;

import com.iker.Lexly.Entity.Documents;
import com.iker.Lexly.Entity.Template;
import com.iker.Lexly.Entity.User;
import com.iker.Lexly.repository.TemplateRepository;
import com.iker.Lexly.responses.ApiResponseDocuments;
import com.iker.Lexly.responses.GuestDocumentResponse;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import java.time.LocalDateTime;

@Service
public class GuestService {
    private final TemplateRepository templateRepository;
    private static final Logger logger = LoggerFactory.getLogger(DocumentsService.class);

    public GuestService(TemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
    }

    public GuestDocumentResponse createNewDocument(Long templateId) {
            Template template = templateRepository.findById(templateId).orElse(null);
            if (template != null) {
                    Documents document = new Documents();
                    logger.info("Document has been created successfully {}");
                    return new GuestDocumentResponse("Document created successfully.");
                } else {
                    return new GuestDocumentResponse("User not found.");
                }
            }
        }

