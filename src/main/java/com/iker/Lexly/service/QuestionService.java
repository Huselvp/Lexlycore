package com.iker.Lexly.service;
import com.iker.Lexly.DTO.QuestionDTO;
import com.iker.Lexly.Entity.*;
import com.iker.Lexly.Transformer.QuestionTransformer;
import com.iker.Lexly.repository.*;
import com.iker.Lexly.service.form.FormService;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import jakarta.xml.bind.JAXBContext;
import jakarta.xml.bind.JAXBException;
import jakarta.xml.bind.Marshaller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.StringWriter;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;
import java.time.DayOfWeek;
import java.time.format.TextStyle;
import java.util.Locale;


@Service
public class QuestionService {
    @PersistenceContext
    private EntityManager entityManager;
    private final QuestionRepository questionRepository;
    private final TemplateService templateService;
    private final TemplateRepository templateRepository;
    private final DocumentQuestionValueRepository documentQuestionValueRepository;
    private final QuestionTransformer questionTransformer;
    private final DocumentsRepository documentsRepository;
    private final FilterService filterService;
    private final FormService formService;
    Logger logger = LoggerFactory.getLogger(QuestionService.class);

    @Autowired
    public QuestionService(TemplateService templateService, QuestionTransformer questionTransformer, DocumentQuestionValueRepository documentQuestionValueRepository, DocumentsRepository documentsRepository, QuestionRepository questionRepository, TemplateRepository templateRepository, FilterService filterService, FormService formService) {
        this.questionRepository = questionRepository;
        this.templateService = templateService;
        this.questionTransformer = questionTransformer;
        this.templateRepository = templateRepository;
        this.documentsRepository = documentsRepository;
        this.documentQuestionValueRepository = documentQuestionValueRepository;
        this.filterService =filterService;
        this.formService = formService;
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
            Question savedQuestion = questionRepository.save(existingQuestion);
            logger.info("Updated Question successfully :{}",savedQuestion);
            return savedQuestion;
        } else {
            return null;
        }
    }

    @Transactional
    public void deleteQuestion(Long questionId) {
        Question question = entityManager.find(Question.class, questionId);
        if (question != null) {
            if (question.getValueType().equals("filter")){
                filterService.deleteFiltersByQuestionId(questionId);
            }
            if (question.getValueType().equals("form")){
                formService.deleteFormByQuestionId(questionId);
            }
            entityManager.remove(question);
        }
    }

    @Transactional
        public Question createQuestion(Question question, Template template) {
            if (questionRepository.existsByQuestionText(question.getQuestionText())) {
                throw new IllegalArgumentException("Question with the same text already exists");
            }
            String xmlText = transformTextToXml(question.getTexte());
            if (xmlText != null) {
                question.setTexte(question.getTexte());
                Question savedQuestion = questionRepository.save(question);
                savedQuestion.setPosition(savedQuestion.getId().intValue());

                savedQuestion.setTemplate(template);
                logger.info("Created Question successfully :{}",savedQuestion);
                return questionRepository.save(savedQuestion);

            } else {
                logger.error("The content is not valid XML.");
                throw new IllegalArgumentException("The content is not valid XML.");
            }
        }


    public void reorderQuestions(List<Long> questionsIds) {

        Set<Long> uniqueQuestionIds = new HashSet<>(questionsIds);
        if (uniqueQuestionIds.size() < questionsIds.size()) {
            throw new IllegalArgumentException("Duplicate user IDs found in the list.");
        }
        List<Question> questions = questionRepository.findAllById(questionsIds);
        for (int i = 0; i < questionsIds.size(); i++) {
            long questionId = questionsIds.get(i);
            Question question = questions.stream().filter(u -> u.getId().equals(questionId)).findFirst().orElse(null);
            if (question != null) {
                question.setPosition(i);
                questionRepository.save(question);
            }
        }
    }



    public Question addOptions(Long questionId, List<String> options) {
        Optional<Question> optionalQuestion = questionRepository.findById(questionId);
        if (optionalQuestion.isPresent()) {
            Question question = optionalQuestion.get();
            question.getList().addAll(options);
            return questionRepository.save(question);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found with id: " + questionId);
        }
    }

    public Question deleteOptions(Long questionId, List<String> options) {
        Optional<Question> optionalQuestion = questionRepository.findById(questionId);
        if (optionalQuestion.isPresent()) {
            Question question = optionalQuestion.get();
            if (question.getList().removeAll(options)) {
                return questionRepository.save(question);
            } else {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Options not found.");
            }
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found with id: " + questionId);
        }
    }


    public Question updateOption(Long questionId, String oldOption, String newOption) {
        Optional<Question> optionalQuestion = questionRepository.findById(questionId);
        if (optionalQuestion.isPresent()) {
            Question question = optionalQuestion.get();
            List<String> options = question.getList();
            int index = options.indexOf(oldOption);
            if (index != -1) {
                options.set(index, newOption);
                return questionRepository.save(question);
            } else {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Option not found: " + oldOption);
            }
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found with id: " + questionId);
        }
    }


    public List<String> getOptions(Long questionId) {
        Optional<Question> optionalQuestion = questionRepository.findById(questionId);
        if (optionalQuestion.isPresent()) {
            Question question = optionalQuestion.get();
            return question.getList();
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found with id: " + questionId);
        }
    }

    private String transformTextToXml(String text) {
        try {
            JAXBContext context = JAXBContext.newInstance(TextWrapper.class);
            Marshaller marshaller = context.createMarshaller();
            marshaller.setProperty(Marshaller.JAXB_FRAGMENT, Boolean.TRUE);
            TextWrapper textWrapper = new TextWrapper(text);
            StringWriter stringWriter = new StringWriter();
            marshaller.marshal(textWrapper, stringWriter);
            return stringWriter.toString();
        } catch (JAXBException e) {
//            e.printStackTrace();
            logger.error("Error transforming text to XML: ", e);
            return null;
        }
    }

    public long calculateDuration(Long startDay, Long  endDay) {


        if (startDay == null || endDay == null) {
            throw new IllegalArgumentException("Invalid day name");
        }

        long daysBetween = endDay - startDay;

        if (daysBetween < 0) {
            daysBetween += 7;
        }

        return daysBetween;
    }





//    public List<Question> getAllQuestionsByTemplateIdOrderByOrder(Long templateId ) {
//        Template template = templateRepository.findById(templateId)
//                .orElseThrow(() -> new IllegalArgumentException("Template not found"));
//        List<Long> order=template.getQuestionOrder();
//        if (order == null || order.isEmpty()) {
//            return questionRepository.findByTemplateIdOrderByPositionAsc(templateId);
//        }
////        List<Question> orderedQuestion = new LinkedList<>(); ;
////        for (Long orderId : order) {
////            Question question=questionRepository.findById(orderId).orElse(null);
////            if (question==null) continue;
////            orderedQuestion.add(question);
////        }
////        return orderedQuestion;
//        return order.stream()
//                .map(orderId -> questionRepository.findById(orderId).orElse(null))
//                .filter(question -> question != null)
//                .collect(Collectors.toList());
//    }
//    @Transactional
//    public void updateQuestionOrder(Long templateId, List<Long> questionOrder) {
//        Template template = templateRepository.findById(templateId)
//                .orElseThrow(() -> new IllegalArgumentException("Template not found"));
//        template.setQuestionOrder(questionOrder);
//        templateRepository.save(template);
//    }


//    public Question deleteAllOptions(Long questionId) {
//        Optional<Question> optionalQuestion = questionRepository.findById(questionId);
//        if (optionalQuestion.isPresent()) {
//            Question question = optionalQuestion.get();
//            question.getList().clear();
//            return questionRepository.save(question);
//        } else {
//            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found with id: " + questionId);
//        }
//    }


    //    @Transactional
//    public Question duplicateList(Long questionId) {
//        Optional<Question> optionalQuestion = questionRepository.findById(questionId);
//        if (optionalQuestion.isPresent()) {
//            Question question = optionalQuestion.get();
//            List<String> originalList = question.getList();
//            List<String> duplicatedList = new ArrayList<>(originalList);
//
//            question.setSecondList(duplicatedList);
//            return questionRepository.save(question);
//        } else {
//            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found with id: " + questionId);
//        }
//    }
//

}

