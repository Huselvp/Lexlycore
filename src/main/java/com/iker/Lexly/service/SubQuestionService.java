package com.iker.Lexly.service;

import com.iker.Lexly.DTO.BlockDTO;
import com.iker.Lexly.DTO.FormDTO;
import com.iker.Lexly.DTO.SubQuestionDTO;
import com.iker.Lexly.Entity.Filter;
import com.iker.Lexly.Entity.Form.Block;
import com.iker.Lexly.Entity.Form.Form;
import com.iker.Lexly.Entity.Form.Label;
import com.iker.Lexly.Entity.Question;
import com.iker.Lexly.Entity.SubQuestion;
import com.iker.Lexly.DTO.QuestionDTO;
import com.iker.Lexly.Entity.Template;
import com.iker.Lexly.Transformer.BlockTransformer;
import com.iker.Lexly.Transformer.FormTransformer;
import com.iker.Lexly.Transformer.LabelTransformer;
import com.iker.Lexly.Transformer.SubQuestionTransformer;
import com.iker.Lexly.repository.FilterRepository;
import com.iker.Lexly.repository.QuestionRepository;
import com.iker.Lexly.repository.SubQuestionRepository;
import com.iker.Lexly.repository.SubcategoryRepository;
import com.iker.Lexly.repository.form.BlockRepository;
import com.iker.Lexly.repository.form.FormRepository;
import com.iker.Lexly.repository.form.LabelRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SubQuestionService {

    private final SubQuestionRepository subQuestionRepository;
    private final QuestionRepository questionRepository;
    private final FormRepository formRepository;
    private final FilterRepository filterRepository;
    private final SubQuestionTransformer subQuestionTransformer;
    private final SubcategoryRepository subcategoryRepository;
    private final BlockRepository blockRepository;
    private final LabelRepository labelRepository;
    private final FormTransformer formTransformer;
    private final BlockTransformer blockTransformer;
    private final LabelTransformer labelTransformer;
    private static final Logger logger = LoggerFactory.getLogger(SubQuestionService.class);
    @Autowired
    public SubQuestionService(SubQuestionRepository subQuestionRepository, QuestionRepository questionRepository, FormRepository formRepository, FilterRepository filterRepository, SubQuestionTransformer subQuestionTransformer, SubcategoryRepository subcategoryRepository, BlockRepository blockRepository, LabelRepository labelRepository, FormTransformer formTransformer, BlockTransformer blockTransformer, LabelTransformer labelTransformer) {
        this.subQuestionRepository = subQuestionRepository;
        this.questionRepository= questionRepository;
        this.formRepository = formRepository;
        this.filterRepository = filterRepository;
        this.subQuestionTransformer = subQuestionTransformer;
        this.subcategoryRepository = subcategoryRepository;
        this.blockRepository = blockRepository;
        this.labelRepository = labelRepository;
        this.formTransformer = formTransformer;
        this.blockTransformer = blockTransformer;
        this.labelTransformer = labelTransformer;
    }

    @Transactional(readOnly = true)
    public List<SubQuestion> getAllSubQuestionsByQuestionId(Long questionId) {
        return subQuestionRepository.findByParentQuestionId(questionId);
    }

//    public List<SubQuestion> getAllSubQuestionsBySubquestionOrder(Long questionId ) {
//        Question question = questionRepository.findById(questionId)
//                .orElseThrow(() -> new IllegalArgumentException("Template not found"));
//        List<Long> orderSubquestions=question.getSubquestionOrder();
//        if (orderSubquestions == null || orderSubquestions.isEmpty()) {
//            return subQuestionRepository.findByParentQuestionId(questionId);
//        }
//        return orderSubquestions.stream()
//                .map(orderId -> subQuestionRepository.findById(orderId).orElse(null))
//                .filter(subQuestion -> subQuestion != null)
//                .collect(Collectors.toList());
//    }

//    @Transactional
//    public void updateSubQuestionOrder(Long questionId, List<Long> subQuestionOrder) {
//        Question parentQuestion = questionRepository.findById(questionId)
//                .orElseThrow(() -> new IllegalArgumentException("Parent question not found"));
//        parentQuestion.setSubquestionOrder(subQuestionOrder);
//        questionRepository.save(parentQuestion);
//    }

    @Transactional
    public SubQuestion createSubQuestion(Long questionId, SubQuestionDTO subQuestionDTO) {
        Question parentQuestion = questionRepository.getById(questionId);
        SubQuestion subQuestion = new SubQuestion();
        subQuestion.setQuestionText(subQuestionDTO.getQuestionText());
        subQuestion.setDescription(subQuestionDTO.getDescription());
        subQuestion.setDescriptionDetails(subQuestionDTO.getDescriptionDetails());
        subQuestion.setValueType(subQuestionDTO.getValueType());
        subQuestion.setTextArea(subQuestionDTO.getTextArea());
        subQuestion.setParentQuestion(parentQuestion);
        SubQuestion subQuestionsaved = subQuestionRepository.save(subQuestion);
        subQuestionsaved.setPosition(subQuestionsaved.getId().intValue());
        logger.info("Created Subquestion successfully :{}",subQuestionsaved );
        return subQuestionsaved;
    }

    @Transactional(readOnly = true)
    public SubQuestion getSubQuestionById(Long subQuestionId) {
        return subQuestionRepository.findById(subQuestionId)
                .orElseThrow(() -> new IllegalArgumentException("Subquestion not found"));
    }

    @Transactional
    public SubQuestion updateSubQuestion(Long questionId, Long subQuestionId, SubQuestionDTO subQuestionDTO) {
        Optional<SubQuestion> subQuestionOptional = subQuestionRepository.findById(subQuestionId);
        if (subQuestionOptional.isPresent()) {
            SubQuestion subQuestion = subQuestionOptional.get();
            if (subQuestionDTO.getQuestionText() != null) {
                subQuestion.setQuestionText(subQuestionDTO.getQuestionText());
            }
            if (subQuestionDTO.getDescription() != null) {
                subQuestion.setDescription(subQuestionDTO.getDescription());
            }
            if (subQuestionDTO.getDescriptionDetails() != null) {
                subQuestion.setDescriptionDetails(subQuestionDTO.getDescriptionDetails());
            }
            if (subQuestionDTO.getValueType() != null) {
                subQuestion.setValueType(subQuestionDTO.getValueType());
            }
            if (subQuestionDTO.getTextArea() != null) {
                subQuestion.setTextArea(subQuestionDTO.getTextArea());
            }
            SubQuestion subQuestionsaved = subQuestionRepository.save(subQuestion);
            logger.info("Updated Subquestion successfully :{}",subQuestionsaved );
            return subQuestionsaved;
        } else {
            throw new IllegalArgumentException("Subquestion not found");
        }
    }

    public void reorderSubQuestions(Long questionId, List<Long> subQuestionsIds) {

        Set<Long> uniqueSubQuestionIds = new HashSet<>(subQuestionsIds);
        if (uniqueSubQuestionIds.size() < subQuestionsIds.size()) {
            throw new IllegalArgumentException("Duplicate user IDs found in the list.");
        }
        List<SubQuestion> subQuestions = subQuestionRepository.findAllById(subQuestionsIds);
        for (int i = 0; i < subQuestionsIds.size(); i++) {
            long subQuestionId = subQuestionsIds.get(i);
            SubQuestion subQuestion = subQuestions.stream().filter(u -> u.getId().equals(subQuestionId)).findFirst().orElse(null);
            if (subQuestion != null) {
                subQuestion.setPosition(i);
                subQuestionRepository.save(subQuestion);
            }
        }
    }

    @Transactional
    public void deleteSubQuestion(Long subQuestionId) {
        if (subQuestionRepository.existsById(subQuestionId)) {
            subQuestionRepository.deleteById(subQuestionId);
        } else {
            throw new IllegalArgumentException("Subquestion not found");
        }
    }
    @Transactional
    public SubQuestionDTO getSubQuestionWithDetails(Long subQuestionId) {
        // Fetch the SubQuestion
        SubQuestion subQuestion = subQuestionRepository.findById(subQuestionId)
                .orElseThrow(() -> new NoSuchElementException("SubQuestion not found for id: " + subQuestionId));

        // Fetch the Form (if exists)
        Form form = formRepository.findBySubQuestionId(subQuestionId)
                .orElse(null);

        // Fetch the Filter (if exists)
        Filter filter = filterRepository.findBySubQuestionId(subQuestionId)
                .orElse(null);

        // Assemble the DTO
        SubQuestionDTO subQuestionDTO = subQuestionTransformer.toDTO(subQuestion);

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

            subQuestionDTO.setForm(formDTO);
        }

        if (filter != null) {
            subQuestionDTO.setFilter(filter);
        }

        return subQuestionDTO;
    }
}
