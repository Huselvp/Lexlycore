package com.iker.Lexly.Controller;

import com.iker.Lexly.DTO.SubQuestionDTO;
import com.iker.Lexly.Entity.Form.Block;
import com.iker.Lexly.Entity.Form.Form;
import com.iker.Lexly.Entity.Question;
import com.iker.Lexly.Entity.SubQuestion;
import com.iker.Lexly.repository.QuestionRepository;
import com.iker.Lexly.request.CompanyDetails;
import com.iker.Lexly.responses.GuestDocumentResponse;
import com.iker.Lexly.service.CompanySearchService;
import com.iker.Lexly.service.GuestService;
import com.iker.Lexly.service.SubQuestionService;
import com.iker.Lexly.service.form.BlockService;
import com.iker.Lexly.service.form.FormService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import java.util.List;
import java.util.NoSuchElementException;


@Controller
public class GuestController {
    private final FormService formService;
    private final BlockService blockService;
    private final GuestService guestService;
    private final QuestionRepository questionRepository;
    private final SubQuestionService subQuestionService;
    private final CompanySearchService companySearchService;

    public GuestController(FormService formService, BlockService blockService, GuestService guestService, QuestionRepository questionRepository, SubQuestionService subQuestionService, CompanySearchService companySearchService) {
        this.formService = formService;
        this.blockService = blockService;
        this.guestService = guestService;
        this.questionRepository = questionRepository;
        this.subQuestionService = subQuestionService;
        this.companySearchService = companySearchService;
    }

    @GetMapping("/guest_find_questions_by_template/{templateId}")
    public List<Question> findQuestionsByTemplateId(@PathVariable Long templateId) {
        List<Question> questionDTOs = questionRepository.findByTemplateId(templateId);
        return questionDTOs;
    }

    @PostMapping("/createDocument/{templateId}")
    public GuestDocumentResponse createNewDocument(@PathVariable Long templateId) {
        GuestDocumentResponse response = guestService.createNewDocument(templateId);
        return response;
    }

    @GetMapping("/sub-question-details/{idSubQuestion}")
    public ResponseEntity<SubQuestionDTO> getSubQuestionWithDetails(@PathVariable Long idSubQuestion) {
        SubQuestionDTO subQuestionDTO = subQuestionService.getSubQuestionWithDetails(idSubQuestion);
        return ResponseEntity.ok(subQuestionDTO);
    }

    @GetMapping("/company-details/{cvr}")
    public ResponseEntity<CompanyDetails> getCompanyDetails(@PathVariable String cvr) {
        return companySearchService.getCompanyDetails(cvr);
    }

    @GetMapping("/questions/subquestions/{questionId}")
    public ResponseEntity<List<SubQuestion>> getAllSubQuestionsByQuestionId(@PathVariable Long questionId) {
        List<SubQuestion> subQuestions = subQuestionService.getAllSubQuestionsByQuestionId(questionId);
        return ResponseEntity.ok(subQuestions);
    }

    @GetMapping("/questions/subquestions/{questionId}/{subQuestionId}")
    public ResponseEntity<SubQuestion> getSubQuestionById(@PathVariable Long questionId, @PathVariable Long subQuestionId) {
        SubQuestion subQuestion = subQuestionService.getSubQuestionById(subQuestionId);
        return ResponseEntity.ok(subQuestion);
    }

    @GetMapping("/all_forms")
    public List<Form> getAllForms() {

        return formService.getAllForms();
    }

    @GetMapping("get-by-question-id/{questionId}")
    public ResponseEntity<?> getFormIdByQuestionId(@PathVariable Long questionId) {
        try {
            Long formId = formService.getFormsByQuestionId(questionId);
            return ResponseEntity.ok(formId);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("get-by-sub-question-id/{subQestionId}")
    public ResponseEntity<?> getFormIdBySubQuestionId(@PathVariable Long subQestionId) {
        try {
            Long formId = formService.getFormsBySubQuestionId(subQestionId);
            return ResponseEntity.ok(formId);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/{idForm}")
    public ResponseEntity<Form> getFormById(@PathVariable Long idForm) {
        Form form = formService.getFormById(idForm);
        if (form != null) {
            return ResponseEntity.ok(form);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/blocks/{idForm}")
    public ResponseEntity<List<Block>> getAllBlocksByFormId(@PathVariable Long idForm) {
        List<Block> blocks = blockService.getAllBlocksByFormId(idForm);
        return ResponseEntity.ok(blocks);
    }

    @GetMapping("/block/{idForm}/{idBlock}")
    public ResponseEntity<Block> getBlockById(@PathVariable Long idForm, @PathVariable Long idBlock) {
        Block block = blockService.getBlockById(idBlock);
        if (block != null) {
            return ResponseEntity.ok(block);
        } else {
            return ResponseEntity.notFound().build();
        }

    }
}

