package com.iker.Lexly.Controller;

import com.iker.Lexly.DTO.SubQuestionDTO;
import com.iker.Lexly.Entity.Question;
import com.iker.Lexly.Entity.SubQuestion;
import com.iker.Lexly.repository.QuestionRepository;
import com.iker.Lexly.request.CompanyDetails;
import com.iker.Lexly.responses.GuestDocumentResponse;
import com.iker.Lexly.service.CompanySearchService;
import com.iker.Lexly.service.GuestService;
import com.iker.Lexly.service.SubQuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;
import java.util.Optional;


@Controller
public class GuestController {
    private final GuestService guestService;
    private final QuestionRepository questionRepository;
    private final SubQuestionService subQuestionService;
    private final CompanySearchService companySearchService;

    public GuestController(GuestService guestService, QuestionRepository questionRepository, SubQuestionService subQuestionService, CompanySearchService companySearchService) {
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
    }

