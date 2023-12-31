package com.iker.Lexly.service;

import com.iker.Lexly.DTO.DocumentQuestionValueDTO;
import com.iker.Lexly.DTO.QuestionDTO;
import com.iker.Lexly.Entity.*;
import com.iker.Lexly.Transformer.QuestionTransformer;
import com.iker.Lexly.repository.*;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuestionService {
    private EntityManagerFactory entityManagerFactory;
    @PersistenceContext
    private EntityManager entityManager;


    private final QuestionRepository questionRepository;
    private final TemplateService templateService;
    private final TemplateRepository templateRepository;
    private final DocumentQuestionValueRepository documentQuestionValueRepository;
    private final QuestionTransformer questionTransformer;
    private final DocumentsRepository documentsRepository;

    @Autowired
    public QuestionService( TemplateService templateService,QuestionTransformer questionTransformer,DocumentQuestionValueRepository documentQuestionValueRepository,DocumentsRepository documentsRepository,QuestionRepository questionRepository,TemplateRepository templateRepository) {
        this.questionRepository = questionRepository;
        this.templateService=templateService;
        this.questionTransformer=questionTransformer;
        this.templateRepository=templateRepository;
        this.documentsRepository=documentsRepository;
        this.documentQuestionValueRepository=documentQuestionValueRepository;
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Question getQuestionById(Long questionId) {
        return questionRepository.findById(questionId)
                .orElse(null);
    }
    @Transactional
    public Question updateQuestion(Long id, QuestionDTO questionDTO) {
        Optional<Question> existingQuestionOptional = questionRepository.findById(id);

        if (existingQuestionOptional.isPresent()) {
            Question existingQuestion = existingQuestionOptional.get();

            existingQuestion.setQuestionText(
                    questionDTO.getQuestionText() != null ? questionDTO.getQuestionText() : existingQuestion.getQuestionText()
            );
            existingQuestion.setValueType(
                    questionDTO.getValueType() != null ? questionDTO.getValueType() : existingQuestion.getValueType()
            );
            existingQuestion.setDescription(
                    questionDTO.getDescription() != null ? questionDTO.getDescription() : existingQuestion.getDescription()
            );
            existingQuestion.setDescriptionDetails(
                    questionDTO.getDescriptionDetails() != null ? questionDTO.getDescriptionDetails() : existingQuestion.getDescriptionDetails()
            );
            existingQuestion.setTexte(
                    questionDTO.getTexte() != null ? questionDTO.getTexte() : existingQuestion.getTexte()
            );
            return questionRepository.save(existingQuestion);
        } else {
            return null;
        }
    }
    @Transactional
    public void deleteQuestion(Long questionId) {
        Question question = entityManager.find(Question.class, questionId);
        if (question != null) {
            entityManager.remove(question);
        }
    }


    public Question createQuestionByTemplateId(Long templateId, Question newQuestion) {
        Template template = templateRepository.findById(templateId)
                .orElseThrow(() -> new EntityNotFoundException("Template not found with ID: " + templateId));
        newQuestion.setTemplate(template);
        return questionRepository.save(newQuestion);
    }

    public DocumentQuestionValueDTO addValueToQuestion(Long questionId, Long documentId, String value) {
        // Fetch question and document entities from repositories
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("Question not found with ID: " + questionId));
        Documents document = documentsRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found with ID: " + documentId));
        DocumentQuestionValue documentQuestionValue = new DocumentQuestionValue();
        documentQuestionValue.setQuestion(question);
        documentQuestionValue.setDocument(document);
        documentQuestionValue.setValue(value);
        documentQuestionValue = documentQuestionValueRepository.save(documentQuestionValue);
        DocumentQuestionValueDTO dto = convertToDTO(documentQuestionValue);
        return dto;
    }
    private DocumentQuestionValueDTO convertToDTO(DocumentQuestionValue documentQuestionValue) {
        DocumentQuestionValueDTO dto = new DocumentQuestionValueDTO();
        dto.setDocumentQuestionValueId(documentQuestionValue.getDocumentQuestionValueId());
        dto.setDocumentId(documentQuestionValue.getDocument().getId());
        dto.setQuestionId(documentQuestionValue.getQuestion().getId());
        dto.setValue(documentQuestionValue.getValue());
        return dto;
    }
    public List<DocumentQuestionValue> getValuesForDocument(Long documentId) {
        return documentQuestionValueRepository.findByDocumentId(documentId);
    }

    public boolean doesQuestionExist(Long templateId, String questionText) {
        return questionRepository.existsByTemplateIdAndQuestionText(templateId, questionText);
    }

    @Transactional
    public Question createQuestion(Question question, Template template) {
        if (questionRepository.existsByQuestionText(question.getQuestionText())) {
            throw new IllegalArgumentException("Question with the same text already exists");
        }
        Question savedQuestion = questionRepository.save(question);
        savedQuestion.setTemplate(template);
        return questionRepository.save(savedQuestion);
    }

}