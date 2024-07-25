package com.iker.Lexly.service;
import com.google.api.gax.rpc.NotFoundException;
import com.iker.Lexly.DTO.BlockDTO;
import com.iker.Lexly.DTO.FormDTO;
import com.iker.Lexly.DTO.QuestionDTO;
import com.iker.Lexly.Entity.*;
import com.iker.Lexly.Entity.Form.Block;
import com.iker.Lexly.Entity.Form.Form;
import com.iker.Lexly.Entity.Form.Label;
import com.iker.Lexly.Transformer.BlockTransformer;
import com.iker.Lexly.Transformer.FormTransformer;
import com.iker.Lexly.Transformer.LabelTransformer;
import com.iker.Lexly.Transformer.QuestionTransformer;
import com.iker.Lexly.repository.*;
import com.iker.Lexly.repository.form.BlockRepository;
import com.iker.Lexly.repository.form.FormRepository;
import com.iker.Lexly.repository.form.LabelRepository;
import com.iker.Lexly.request.ChoiceUpdate;
import com.iker.Lexly.service.form.FormService;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import java.io.StringWriter;
import java.util.*;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;


@Service
public class QuestionService {
    private final SubQuestionRepository subQuestionRepository;
    private final SubQuestionService subQuestionService;
    @PersistenceContext
    private EntityManager entityManager;

    private final QuestionRepository questionRepository;


    private final QuestionTransformer questionTransformer;

    private final FilterService filterService;
    private final FormService formService;
    private final FormRepository formRepository;
    private final BlockRepository blockRepository;
    private final LabelRepository labelRepository;
    private final FormTransformer formTransformer;
    private final BlockTransformer blockTransformer;
    private final FilterRepository filterRepository;
    Logger logger = LoggerFactory.getLogger(QuestionService.class);

    @Autowired
    public QuestionService(
            TemplateService templateService,
            QuestionTransformer questionTransformer,
            DocumentQuestionValueRepository documentQuestionValueRepository,
            DocumentsRepository documentsRepository,
            QuestionRepository questionRepository,
            TemplateRepository templateRepository,
            FilterService filterService,
            FormService formService,
            FormRepository formRepository,
            BlockRepository blockRepository,
            LabelRepository labelRepository,
            FormTransformer formTransformer,
            BlockTransformer blockTransformer,
            LabelTransformer labelTransformer, FilterRepository filterRepository,
            SubQuestionRepository subQuestionRepository, SubQuestionService subQuestionService) {
        this.questionRepository = questionRepository;
        this.questionTransformer = questionTransformer;
        this.filterService = filterService;
        this.formService = formService;
        this.formRepository = formRepository;
        this.blockRepository = blockRepository;
        this.labelRepository = labelRepository;
        this.formTransformer = formTransformer;
        this.blockTransformer = blockTransformer;
        this.filterRepository = filterRepository;
        this.subQuestionRepository = subQuestionRepository;
        this.subQuestionService = subQuestionService;
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

            List <SubQuestion> subQuestions = subQuestionRepository.findByParentQuestionId(questionId);
            for(SubQuestion subQuestion : subQuestions){
                subQuestionService.deleteSubQuestion(subQuestion.getId());
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


    @Transactional
    public QuestionDTO getQuestionWithDetails(Long questionId) {
        // Fetch the Question
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new NoSuchElementException("Question not found for id: " + questionId));

        // Fetch the Filter
        Filter filter = filterRepository.findByQuestionId(questionId)
                .orElse(null);
        // Fetch the Form
        Form form = formRepository.findByQuestionId(questionId)
                .orElse(null);
        // Assemble the DTO
        QuestionDTO questionDTO = questionTransformer.toDTO(question);
        if (form != null) {
            FormDTO formDTO = formTransformer.toDTO(form);
            // Fetch the Blocks
            List<Block> blocks = blockRepository.findByFormId(form.getId());
            if (!blocks.isEmpty()) {
                // Fetch the Labels for each Block
                Map<Long, List<Label>> labelsByBlockId = blocks.stream()
                        .collect(Collectors.toMap(Block::getId, block -> labelRepository.findByBlockId(block.getId())));

                List<BlockDTO> blockDTOs = blocks.stream()
                        .map(block -> blockTransformer.toDTO(block, labelsByBlockId.get(block.getId())))
                        .collect(Collectors.toList());

                formDTO.setBlocks(blockDTOs);
            }

            questionDTO.setForm(formDTO);
        }

        if (filter != null) {

            questionDTO.setFilter(filter);
        }

        return questionDTO;
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
            e.printStackTrace();
            logger.error("Error transforming text to XML: ", e);
            return "Error transforming text to XML: ";
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

    public <T> void addChoice(T item, ChoiceUpdate choiceUpdate) {
        String valueType = getValueType(item);
        if (valueType == null || !valueType.startsWith("checkbox")) {
            throw new IllegalArgumentException("Invalid value type");
        }
        Pattern pattern = Pattern.compile("(\\d+)/[^/]+/[^/]+");
        Matcher matcher = pattern.matcher(valueType);

        List<Integer> choiceIds = new ArrayList<>();
        while (matcher.find()) {
            choiceIds.add(Integer.parseInt(matcher.group(1)));
        }
        int maxChoiceId = choiceIds.stream().max(Integer::compare).orElse(0);
        int newChoiceId = maxChoiceId + 1;
        String newChoice = newChoiceId + "/" + choiceUpdate.getNewRelatedText() + "/" + choiceUpdate.getChoice();
        setValueType(item, valueType + "/" + newChoice);
        saveItem(item);
    }

    public <T> void updateChoice(T item, Integer choiceId, ChoiceUpdate choiceUpdate) {
        String valueType = getValueType(item);
        if (valueType == null || !valueType.startsWith("checkbox/")) {
            throw new IllegalArgumentException("Invalid value type");
        }
        String checkboxPrefix = "checkbox/";
        String valueTypeWithoutCheckbox = valueType.substring(checkboxPrefix.length());
        String[] choices = valueTypeWithoutCheckbox.split("/");

        boolean choiceFound = false;
        for (int i = 0; i < choices.length; i += 3) {
            int currentChoiceId = Integer.parseInt(choices[i]);
            if (currentChoiceId == choiceId) {
                choices[i + 1] = choiceUpdate.getNewRelatedText();
                choices[i + 2] = choiceUpdate.getChoice();
                choiceFound = true;
                break;
            }
        }
        if (!choiceFound) {
            throw new NoSuchElementException("Choice not found");
        }
        String updatedValueType = checkboxPrefix + String.join("/", choices);
        setValueType(item, updatedValueType);
        saveItem(item);
    }

    public <T> void deleteChoice(T item, Integer choiceId) {
        String valueType = getValueType(item);
        if (valueType == null || !valueType.startsWith("checkbox/")) {
            throw new IllegalArgumentException("Invalid value type");
        }
        String checkboxPrefix = "checkbox/";
        String valueTypeWithoutCheckbox = valueType.substring(checkboxPrefix.length());
        String[] choices = valueTypeWithoutCheckbox.split("/");
        boolean choiceFound = false;

        for (int i = 0; i < choices.length; i += 3) {
            int currentChoiceId = Integer.parseInt(choices[i]);
            if (currentChoiceId == choiceId) {
                String[] updatedChoices;
                if (choices.length == 3) {
                    updatedChoices = new String[0];
                } else {
                    updatedChoices = new String[choices.length - 3];
                    System.arraycopy(choices, 0, updatedChoices, 0, i);
                    System.arraycopy(choices, i + 3, updatedChoices, i, choices.length - (i + 3));
                }
                String updatedValueType = updatedChoices.length == 0 ?
                        checkboxPrefix.substring(0, checkboxPrefix.length() - 1) :
                        checkboxPrefix + String.join("/", updatedChoices);
                setValueType(item, updatedValueType);
                saveItem(item);
                choiceFound = true;
                break;
            }
        }
        if (!choiceFound) {
            throw new NoSuchElementException("Choice not found");
        }
    }

    private <T> String getValueType(T item) {
        if (item instanceof Question) {
            return ((Question) item).getValueType();
        } else if (item instanceof SubQuestion) {
            return ((SubQuestion) item).getValueType();
        }
        throw new IllegalArgumentException("Unsupported item type");
    }

    private <T> void setValueType(T item, String valueType) {
        if (item instanceof Question) {
            ((Question) item).setValueType(valueType);
        } else if (item instanceof SubQuestion) {
            ((SubQuestion) item).setValueType(valueType);
        } else {
            throw new IllegalArgumentException("Unsupported item type");
        }
    }

    private <T> void saveItem(T item) {
        if (item instanceof Question) {
            questionRepository.save((Question) item);
        } else if (item instanceof SubQuestion) {
            subQuestionRepository.save((SubQuestion) item);
        } else {
            throw new IllegalArgumentException("Unsupported item type");
        }
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

