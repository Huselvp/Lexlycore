package com.iker.Lexly.service;

import com.iker.Lexly.DTO.DocumentQuestionValueDTO;
import com.iker.Lexly.DTO.QuestionDTO;
import com.iker.Lexly.Entity.*;
import com.iker.Lexly.Transformer.QuestionTransformer;
import com.iker.Lexly.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final TemplateRepository templateRepository;
    private final DocumentQuestionValueRepository documentQuestionValueRepository;
    private final QuestionTransformer questionTransformer;
    private final ChoicesRelatedTexteRepository choicesRelatedTexteRepository;
    private final DocumentsRepository documentsRepository;

    @Autowired
    public QuestionService( QuestionTransformer questionTransformer,ChoicesRelatedTexteRepository choicesRelatedTexteRepository,DocumentQuestionValueRepository documentQuestionValueRepository,DocumentsRepository documentsRepository,QuestionRepository questionRepository,TemplateRepository templateRepository) {
        this.questionRepository = questionRepository;
        this.questionTransformer=questionTransformer;
        this.templateRepository=templateRepository;
        this.documentsRepository=documentsRepository;
        this.choicesRelatedTexteRepository=choicesRelatedTexteRepository;
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
        Optional<Question> optionalQuestion = questionRepository.findById(questionId);
        optionalQuestion.ifPresent(question -> {
            questionRepository.delete(question);
        });
    }

    public List<QuestionDTO> findQuestionsByTemplateId(Long templateId) {
        List<Question> questions = questionRepository.findByTemplateId(templateId);
        return questions.stream()
                .map(this::mapQuestionToDTO)
                .collect(Collectors.toList());
    }

    private QuestionDTO mapQuestionToDTO(Question question) {
        QuestionDTO questionDTOs = questionTransformer.toDTO(question);
        if ("checkbox".equals(question.getValueType())) {
            questionDTOs.setChoiceRelatedTextePairs(question.getChoices());
        } else {
            questionDTOs.setChoiceRelatedTextePairs(null);
        }

        return questionDTOs;
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