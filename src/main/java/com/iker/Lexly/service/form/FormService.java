package com.iker.Lexly.service.form;



import com.iker.Lexly.Entity.Form.Form;
import com.iker.Lexly.Entity.Form.Block;
import com.iker.Lexly.Entity.Question;
import com.iker.Lexly.repository.QuestionRepository;
import com.iker.Lexly.repository.form.FormRepository;
import com.iker.Lexly.repository.form.BlockRepository;
import com.iker.Lexly.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class FormService {

    private final FormRepository formRepository;
    private final BlockRepository blockRepository;
    private final BlockService blockService;
    private final QuestionRepository questionRepository;

    @Autowired
    public FormService(FormRepository formRepository, BlockRepository blockRepository, BlockService blockService,QuestionRepository questionRepository) {
        this.formRepository = formRepository;
        this.blockRepository = blockRepository;
        this.blockService = blockService;
        this.questionRepository=questionRepository;
    }

    @Transactional(readOnly = true)
    public List<Form> getAllForms() {
        return formRepository.findAll();
    }

    @Transactional
    public Form createForm(Long questionId,Form form ) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new NoSuchElementException("Question not found with id: " + questionId));

        // Associate the form with the question
        form.setQuestion(question);
        Form savedForm = formRepository.save(form);

        // Create and save the block associated with the form
        Block block = new Block();
        block.setForm(savedForm);
        blockRepository.save(block);

        return savedForm;
    }

    @Transactional(readOnly = true)
    public Form getFormById(Long formId) {
        return formRepository.findById(formId)
                .orElseThrow(() -> new IllegalArgumentException("Form not found"));
    }

    @Transactional
    public Form updateForm(Long formId, Form updatedForm) {
        Optional<Form> formOptional = formRepository.findById(formId);
        if (formOptional.isPresent()) {
            Form form = formOptional.get();
            form.setTitle(updatedForm.getTitle());
            return formRepository.save(form);
        } else {
            throw new IllegalArgumentException("Form not found");
        }
    }

    @Transactional
    public void deleteForm(Long formId) {
        if (formRepository.existsById(formId)) {
            List<Block> formBlocks = blockService.getAllBlocksByFormId(formId);
            for (Block formBlock : formBlocks) {
                blockService.deleteBlock(formBlock.getId());
            }

            formRepository.deleteById(formId);
        } else {
            throw new IllegalArgumentException("Form not found");
        }
    }

//    @Transactional
//    public Form duplicateForm(Long formId) {
//        Form originalForm = formRepository.findById(formId)
//                .orElseThrow(() -> new IllegalArgumentException("Form not found"));
//        Form newForm = new Form();
//        newForm.setTitle(originalForm.getTitle());
//        newForm = formRepository.save(newForm);
//        List<Block> existingFormBlocks = blockRepository.findByFormId(formId);
//        for(Block block : existingFormBlocks) {
//            blockService.duplicateBlock(newForm.getId(), block.getId());
//        }
//
//        return newForm;
//    }



}
