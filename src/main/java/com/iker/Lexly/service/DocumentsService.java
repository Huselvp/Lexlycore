package com.iker.Lexly.service;

import com.iker.Lexly.DTO.DocumentQuestionValueDTO;
import com.iker.Lexly.DTO.DocumentsDTO;
import com.iker.Lexly.DTO.QuestionDTO;
import com.iker.Lexly.Entity.*;
import com.iker.Lexly.repository.*;
import com.iker.Lexly.request.DocumentCreateRequest;
import com.iker.Lexly.request.UpdateValueRequest;
import com.iker.Lexly.responses.ApiResponse;
import com.iker.Lexly.responses.ApiResponseDocuments;
import jakarta.transaction.Transactional;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
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

    public ApiResponse updateValueandSave(UpdateValueRequest request) {
        Long documentId = request.getDocumentId();
        Long questionId = request.getQuestionId();
        String value = request.getValue();
        Documents document = documentsRepository.findById(documentId).orElse(null);
        Question question = questionRepository.findById(questionId).orElse(null);

        if (document != null && question != null) {
            DocumentQuestionValue existingValue = documentQuestionValueRepository.findByDocumentAndQuestion(document, question);

            if (existingValue != null) {
                existingValue.setValue(value);
                System.out.println("the value is " + value);
                documentQuestionValueRepository.save(existingValue);
                return new ApiResponse("Value updated successfully.", null);
            } else {
                DocumentQuestionValue newValue = new DocumentQuestionValue();
                newValue.setDocument(document);
                newValue.setQuestion(question);
                newValue.setValue(value);
                documentQuestionValueRepository.save(newValue);
                return new ApiResponse("Value added and saved successfully.", null);
            }
        } else {
            return new ApiResponse("Document or question not found.", null);
        }
    }

    public String DocumentProcess(List<Question> questions, Long documentId, Long templateId, List<DocumentQuestionValue> documentQuestionValues) {
        StringBuilder concatenatedText = new StringBuilder();

        for (Question question : questions) {
            if (question.getTemplate().getId().equals(templateId)) {
                String Texte = question.getTexte();
                if (question.getValueType().equals("checkbox")) {
                    Texte = replaceCheckboxValues(Texte, question.getChoices());
                } else {
                    Texte = replaceValues(Texte, question.getId(), documentQuestionValues);
                }
                concatenatedText.append(Texte).append(" ");
            }
        }

        return concatenatedText.toString();
    }
    private String replaceCheckboxValues(String questionText, List<ChoiceRelatedTextePair> choices) {
        for (ChoiceRelatedTextePair pair : choices) {
            questionText = questionText.replace("[" + pair.getChoice() + "]", pair.getRelatedTexte());
        }
        return questionText;
    }
    private String replaceValues(String Texte, Long questionId, List<DocumentQuestionValue> documentQuestionValues) {
        for (DocumentQuestionValue documentQuestionValue : documentQuestionValues) {
            if (documentQuestionValue.getQuestion().getId().equals(questionId)) {
                if (documentQuestionValue.getValue() != null) {
                   Texte = Texte.replace("[value]", documentQuestionValue.getValue());
                } else {
                    Texte = Texte.replace("[value]", "null");
                }
                break;
            }
        }
        return Texte;
    }
    public void generatePdfFromText(String text, String outputFilePath) {
        try {
            PDDocument document = new PDDocument();
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            PDPageContentStream contentStream = new PDPageContentStream(document, page);
            contentStream.setFont(PDType1Font.HELVETICA, 12);
            contentStream.beginText();
            contentStream.newLineAtOffset(50, 700);
            contentStream.showText(text);
            contentStream.endText();
            contentStream.close();

            document.save(outputFilePath);
            document.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


}




