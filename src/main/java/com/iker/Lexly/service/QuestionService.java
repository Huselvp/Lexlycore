package com.iker.Lexly.service;

import com.iker.Lexly.DTO.DocumentQuestionValueDTO;
import com.iker.Lexly.DTO.QuestionDTO;
import com.iker.Lexly.Entity.DocumentQuestionValue;
import com.iker.Lexly.Entity.Documents;
import com.iker.Lexly.Entity.Question;
import com.iker.Lexly.Entity.Template;
import com.iker.Lexly.repository.DocumentQuestionValueRepository;
import com.iker.Lexly.repository.DocumentsRepository;
import com.iker.Lexly.repository.QuestionRepository;
import com.iker.Lexly.repository.TemplateRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final TemplateRepository templateRepository;
    private final DocumentQuestionValueRepository documentQuestionValueRepository;
    private final DocumentsRepository documentsRepository;

    @Autowired
    public QuestionService(DocumentQuestionValueRepository documentQuestionValueRepository,DocumentsRepository documentsRepository,QuestionRepository questionRepository,TemplateRepository templateRepository) {
        this.questionRepository = questionRepository;
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
    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }
    public Question updateQuestion(Long id, QuestionDTO questionDTO) {
        Optional<Question> existingQuestionOptional = questionRepository.findById(id);
        if (existingQuestionOptional.isPresent()) {
            Question existingQuestion = existingQuestionOptional.get();
            existingQuestion.getDocumentQuestionValues().clear();
            existingQuestion.setQuestionText(questionDTO.getQuestionText());
            existingQuestion.setValueType(questionDTO.getValueType());
            existingQuestion.setDescription(questionDTO.getDescription());
            existingQuestion.setDescriptionDetails(questionDTO.getDescriptionDetails());
            existingQuestion.setTexte(questionDTO.getTexte());
            return questionRepository.save(existingQuestion);
        } else {
            return null;
        }
    }
    public void deleteQuestion(Long questionId) {
        // Get the question
        Question question = questionRepository.findById(questionId).orElse(null);

        if (question != null) {
            if ("checkbox".equals(question.getValueType())) {
                //choiceService.deleteChoicesByQuestion(question);
            }
            questionRepository.delete(question);
        }
    }

    public List<Question> findQuestionsByTemplateId(Long templateId) {
        return questionRepository.findByTemplateId(templateId);
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
}