package com.iker.Lexly.Controller;
import com.iker.Lexly.Auth.AuthenticationRequest;
import com.iker.Lexly.Auth.AuthenticationResponse;
import com.iker.Lexly.Auth.AuthenticationService;
import com.iker.Lexly.Auth.RegisterRequest;
import com.iker.Lexly.DTO.*;
import com.iker.Lexly.Entity.*;
import com.iker.Lexly.Entity.Form.Block;
import com.iker.Lexly.Entity.Form.Form;
import com.iker.Lexly.Entity.Form.Label;
import com.iker.Lexly.Entity.enums.Role;
import com.iker.Lexly.Transformer.SubCategoryTransformer;
import com.iker.Lexly.config.jwt.JwtService;
import com.iker.Lexly.repository.QuestionRepository;
import com.iker.Lexly.repository.TemplateRepository;
import com.iker.Lexly.repository.UserRepository;
import com.iker.Lexly.repository.form.FormRepository;
import com.iker.Lexly.request.AddLabelOption;
import com.iker.Lexly.request.ChoiceUpdate;
import com.iker.Lexly.responses.ApiResponse;
import com.iker.Lexly.Transformer.QuestionTransformer;
import com.iker.Lexly.Transformer.TemplateTransformer;
import com.iker.Lexly.Transformer.UserTransformer;

import com.iker.Lexly.service.*;
import com.iker.Lexly.service.form.BlockService;
import com.iker.Lexly.service.form.FormService;
import com.iker.Lexly.service.form.LabelService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')")

public class adminController {
    private final UserService userService;
    private final SubQuestionService subQuestionService;
    private final UserTransformer userTransformer;
    private final SubcategoryService subcategoryService;
    private final UserRepository userRepository;
    private  final PasswordEncoder passwordEncoder;
    private final QuestionTransformer questionTransformer;
    private final QuestionRepository questionRepository;
    private final TemplateRepository templateRepository;
    private final SubCategoryTransformer subcategoryTransformer;


    @Autowired
    private final TemplateService templateService;
    private  final AuthenticationService service;
    @Autowired
    private final QuestionService questionService;
    private final TemplateTransformer templateTransformer;
    private final JwtService jwtService;

    @Autowired
    public adminController(SubCategoryTransformer subCategoryTransformer, SubcategoryService subcategoryService, UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService , TemplateRepository templateRepository, QuestionRepository questionRepository, DocumentsService documentsService, UserService userService, SubQuestionService subQuestionService, UserTransformer userTransformer, QuestionTransformer questionTransformer1, TemplateService templateService, QuestionService questionService, TemplateTransformer templateTransformer, FormRepository formRepository, AuthenticationService service) {
        this.subQuestionService = subQuestionService;
        this.templateService = templateService;
        this.jwtService=jwtService;
        this.subcategoryTransformer=subCategoryTransformer;
        this.subcategoryService=subcategoryService;
        this.passwordEncoder=passwordEncoder;
        this.userRepository=userRepository;
        this.questionRepository = questionRepository;
        this.templateRepository = templateRepository;
        this.userTransformer = userTransformer;
        this.questionService = questionService;
        this.templateTransformer = templateTransformer;
        this.questionTransformer = questionTransformer1;
        this.userService = userService;


        this.service = service;
    }
//    @PreAuthorize("permitAll()")
//    @PostMapping("/login")
//    public ResponseEntity<AuthenticationResponse> authenticate(
//            @RequestBody AuthenticationRequest request,
//            HttpServletResponse response
//    ) {
//        AuthenticationResponse authenticationResponse = service.authenticate(request, response);
//        return ResponseEntity.ok(authenticationResponse);
//    }
//    @PreAuthorize("permitAll()")
//    @PostMapping("/register")
//    public ResponseEntity<AuthenticationResponse> register(
//            @RequestBody RegisterRequest request,
//            HttpServletResponse response
//    ) {
//        request.setRole(Role.ADMIN);
//        AuthenticationResponse authenticationResponse = service.register(request, response);
//        return ResponseEntity.ok(authenticationResponse);
//    }
    @PostMapping("/addSubCategory")
    public ResponseEntity<String> addSubCategory(@RequestBody SubcategoryDTO subcategoryDTO) {
        String result = subcategoryService.addSubCategory(subcategoryDTO);
        return ResponseEntity.ok(result);
    }
    @PutMapping("/updateSubcategory/{id}")
    public ResponseEntity<ApiResponse> updateSubCategory(@PathVariable Long id, @RequestBody SubcategoryDTO subcategoryDTO) {
        ApiResponse response = subcategoryService.updateSubCategory(id, subcategoryDTO);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
    @DeleteMapping("/DeleteSubcategory/{id}")
    public ResponseEntity<String> deleteSubCategory(@PathVariable Long id) {
        String result = subcategoryService.deleteSubCategory(id);
        return ResponseEntity.ok(result);
    }
    @PostMapping("/assignSubcategory/{templateId}/{subcategoryId}")
    public ApiResponse assignSubcategoryToTemplate(@PathVariable Long templateId, @PathVariable Long subcategoryId) {
        return templateService.assignSubcategoryToTemplate(templateId, subcategoryId);
    }
    @GetMapping("/all_users")
    public List<UserDTO> getAllUsers(HttpServletRequest request) {
        List<User> users = userService.getAllUsers();
        List<UserDTO> userDTOs = users.stream()
                .map(userTransformer::toDTO)
                .collect(Collectors.toList());
        return userDTOs;
    }
    @DeleteMapping("/delete_user/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("question with ID " + id + " has been deleted successfully.");
    }
    @PutMapping("/update_category/{templateId}/{newCategoryId}")
    public ResponseEntity<ApiResponse> updateCategoryForTemplate(
            @PathVariable Long templateId,
            @PathVariable Long newCategoryId
    ) {
        ApiResponse response = templateService.updateCategoryForTemplate(templateId, newCategoryId);
        if (response != null) {
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @PostMapping(value = "/create_template/{token}", produces = "application/json")
    public ResponseEntity<ApiResponse> createTemplate(@PathVariable String token, @RequestBody Template template) {
        ApiResponse apiResponse = templateService.createTemplate(token, template);
        return ResponseEntity.ok(apiResponse);
    }


    @PutMapping("/update_template/{templateId}")
    public ResponseEntity<TemplateDTO> updateTemplate(
            @PathVariable Long templateId,
            @RequestBody TemplateDTO updateRequest
    ) {
        Template updatedTemplate = templateService.updateTemplate(templateId, updateRequest);
        if (updatedTemplate != null) {
            TemplateDTO updatedTemplateDTO = templateTransformer.toDTO(updatedTemplate);
            return new ResponseEntity<>(updatedTemplateDTO, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @DeleteMapping("delete_template/{id}")
    public ResponseEntity<String> deleteTemplate(@PathVariable Long id) {
        Template template = templateService.getTemplateById(id);
        if (template != null) {
            List<Documents> documents = template.getDocuments();
            if (!documents.isEmpty()) {
                for (Documents document : documents) {
                    templateService.deleteTemplate(document.getId());
                }
            }
            templateService.deleteTemplate(id);
            return ResponseEntity.ok("Template with ID " + id + " has been deleted successfully.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    /*@GetMapping("/all_questions")
    public List<QuestionDTO> getAllQuestions() {
        List<Question> questions = questionService.getAllQuestions();
        List<QuestionDTO> questionDTOs = questions.stream()
                .map(questionTransformer::toDTO)
                .collect(Collectors.toList());
        return questionDTOs;
    }*/

    @GetMapping("/all_questions")
    public List<QuestionDTO> getAllQuestions() {
        List<Question> questions = questionService.getAllQuestions();
        List<QuestionDTO> questionDTOs = questions.stream()
                .map(question -> questionTransformer.toDTOWithSubQuestions(question))
                .collect(Collectors.toList());
        return questionDTOs;
    }




    @PostMapping(value = "/create_question/{templateId}", consumes = "application/json;charset=UTF-8")
    public ResponseEntity<Question> createQuestion(
            @PathVariable Long templateId,
            @RequestBody Question request) {
        Template template = templateRepository.findById(templateId)
                .orElseThrow(() -> new RuntimeException("Template not found"));
        Question question = questionService.createQuestion(request, template);
        return ResponseEntity.ok(question);
    }

    @GetMapping("/find_questions_by_template/{templateId}")
    public List<Question> findQuestionsByTemplateId(@PathVariable Long templateId) {
        List<Question> questionDTOs = questionRepository.findByTemplateId(templateId);
        return questionDTOs;
    }


    @PutMapping("/update_question/{id}") //valide
    public ResponseEntity<QuestionDTO> updateQuestion(
            @PathVariable Long id,
            @RequestBody QuestionDTO updateRequest
    ) {
        Question updatedQuestion = questionService.updateQuestion(id, updateRequest);
        if (updatedQuestion != null) {
            QuestionDTO updatedQuestionDTO = questionTransformer.toDTO(updatedQuestion);
            return new ResponseEntity<>(updatedQuestionDTO, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    /*@GetMapping("question/{questionId}")
    public ResponseEntity<QuestionDTO> getQuestionById(@PathVariable Long questionId) {
        Question question = questionService.getQuestionById(questionId);
        if (question != null) {
            QuestionDTO questionDTO = questionTransformer.toDTO(question);
            return new ResponseEntity<>(questionDTO, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }*/

    @GetMapping("question/{questionId}")
    public ResponseEntity<QuestionDTO> getQuestionById(@PathVariable Long questionId) {
        Question question = questionService.getQuestionById(questionId);
        if (question != null) {
            QuestionDTO questionDTO = questionTransformer.toDTOWithSubQuestions(question);
            return new ResponseEntity<>(questionDTO, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    @PutMapping("question/reorder")
    public ResponseEntity<String> reoderQuestion (@RequestBody List<Long> questionIds) {
        try {
            questionService.reorderQuestions(questionIds);
            return new ResponseEntity<>("Questions reordered successfully.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error reordering questions.", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
//    @PostMapping("/{questionId}/duplicate")
//    public ResponseEntity<Question> duplicateOptions(@PathVariable Long questionId) {
//        Question duplicatedQuestion = questionService.duplicateList(questionId);
//        return new ResponseEntity<>(duplicatedQuestion, HttpStatus.OK);
//    }

    @PostMapping("/{questionId}/options")
    public ResponseEntity<Question> addOptions(@PathVariable Long questionId, @RequestBody List<String> options) {
        Question updatedQuestion = questionService.addOptions(questionId, options);
        return ResponseEntity.ok(updatedQuestion);
    }

    @DeleteMapping("/{questionId}/options")
    public ResponseEntity<Question> deleteOptions(@PathVariable Long questionId, @RequestBody List<String> options) {
        Question updatedQuestion = questionService.deleteOptions(questionId, options);
        return ResponseEntity.ok(updatedQuestion);
    }
    @PutMapping("/{questionId}/options")
    public ResponseEntity<Question> updateOption(@PathVariable Long questionId, @RequestParam String oldOption, @RequestParam String newOption) {
        Question updatedQuestion = questionService.updateOption(questionId, oldOption, newOption);
        return ResponseEntity.ok(updatedQuestion);
    }

    @GetMapping("/{questionId}/options")
    public ResponseEntity<List<String>> getOptions(@PathVariable Long questionId) {
        List<String> options = questionService.getOptions(questionId);
        return ResponseEntity.ok(options);
    }


    @DeleteMapping("delete_question/{id}")
    public ResponseEntity<String> deleteQuestion(@PathVariable Long id) {
        Optional<Question> optionalQuestion = questionRepository.findById(id);
        if (optionalQuestion.isPresent()) {
            Question question = optionalQuestion.get();
            questionService.deleteQuestion(id);
            QuestionDTO questionDTO = questionTransformer.toDTO(question);
            return ResponseEntity.ok("Question with ID " + id + " has been deleted successfully. DTO: " + questionDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    /*@GetMapping("/questions/subquestions/{questionId}")
    public ResponseEntity<List<SubQuestion>> getAllSubQuestionsByQuestionId(@PathVariable Long questionId) {
        List<SubQuestion> subQuestions = subQuestionService.getAllSubQuestionsByQuestionId(questionId);
        return ResponseEntity.ok(subQuestions);
    }*/

    @GetMapping("/questions/subquestions/{questionId}")
    public ResponseEntity<List<SubQuestionDTO>> getAllSubQuestionsByQuestionId(@PathVariable Long questionId) {
        List<SubQuestionDTO> subQuestions = subQuestionService.getAllSubQuestionsByQuestionId(questionId);
        return ResponseEntity.ok(subQuestions);
    }

    @PostMapping("/questions/subquestions/{questionId}")
    public ResponseEntity<SubQuestion> createSubQuestion(@PathVariable Long questionId, @RequestBody SubQuestionDTO subQuestionDTO) {
        SubQuestion createdSubQuestion = subQuestionService.createSubQuestion(questionId, subQuestionDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSubQuestion);
    }

    @PostMapping("/subquestions/{parentSubQuestionId}")
    public ResponseEntity<SubQuestion> createSubSubQuestion(
            @PathVariable Long parentSubQuestionId,
            @RequestBody SubQuestionDTO subQuestionDTO) {
        SubQuestion createdSubQuestion = subQuestionService.createSubSubQuestion(parentSubQuestionId, subQuestionDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSubQuestion);
    }

    @GetMapping("/questions/subquestions/{questionId}/{subQuestionId}")
    public ResponseEntity<SubQuestion> getSubQuestionById(@PathVariable Long questionId, @PathVariable Long subQuestionId) {
        SubQuestion subQuestion = subQuestionService.getSubQuestionById(subQuestionId);
        return ResponseEntity.ok(subQuestion);
    }

    @PutMapping("/questions/subquestions/{questionId}/{subQuestionId}")
    public ResponseEntity<SubQuestion> updateSubQuestion(@PathVariable Long questionId, @PathVariable Long subQuestionId, @RequestBody SubQuestionDTO subQuestionDTO) {
        SubQuestion updatedSubQuestion = subQuestionService.updateSubQuestion(questionId, subQuestionId, subQuestionDTO);
        return ResponseEntity.ok(updatedSubQuestion);
    }

    @DeleteMapping("/questions/subquestions/{questionId}/{subQuestionId}")
    public ResponseEntity<String> deleteSubQuestion(@PathVariable Long questionId, @PathVariable Long subQuestionId) {
        subQuestionService.deleteSubQuestion(subQuestionId);
        return ResponseEntity.ok("Subquestion with ID " + subQuestionId + " has been successfully deleted.");
    }
    @PutMapping("/questions/subquestions/reorder/{questionId}")
    public ResponseEntity<String> reorderSubQuestion(@PathVariable Long questionId, @RequestBody List<Long> subQuestionIds) {
        try{
            subQuestionService.reorderSubQuestions(questionId,subQuestionIds);
            return new ResponseEntity<>("SubQuestions reordered successfully.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error reordering sbquestions.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    @PostMapping("add-choice-question/{questionId}")
    public ResponseEntity<Void> addChoiceToQuestion(
            @PathVariable Long questionId,
            @RequestBody ChoiceUpdate choiceUpdate) {
        Question question = questionService.getQuestionById(questionId);
        if (question.getValueType() == null || !question.getValueType().startsWith("checkbox")) {
            return ResponseEntity.badRequest().build();
        }
        Pattern pattern = Pattern.compile("(\\d+)/[^/]+/[^/]+");
        Matcher matcher = pattern.matcher(question.getValueType());

        List<Integer> choiceIds = new ArrayList<>();
        while (matcher.find()) {
            choiceIds.add(Integer.parseInt(matcher.group(1)));
        }
        int maxChoiceId = choiceIds.stream().max(Integer::compare).orElse(0);
        int newChoiceId = maxChoiceId + 1;
        String newChoice = newChoiceId + "/" + choiceUpdate.getNewRelatedText() + "/" + choiceUpdate.getChoice();
        question.setValueType(question.getValueType() + "/" + newChoice);
        questionRepository.save(question);
        return ResponseEntity.ok().build();
    }

    @PutMapping("update-choice/{questionId}/{choiceId}")
    public ResponseEntity<Void> updateChoice(
            @PathVariable Long questionId,
            @PathVariable Integer choiceId,
            @RequestBody ChoiceUpdate choiceUpdate) {
        try {
            Question question = questionService.getQuestionById(questionId);
            if (question.getValueType() == null || !question.getValueType().startsWith("checkbox/")) {
                return ResponseEntity.badRequest().build();
            }
            String checkboxPrefix = "checkbox/";
            String valueTypeWithoutCheckbox = question.getValueType().substring(checkboxPrefix.length());
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
                return ResponseEntity.notFound().build();
            }
            String updatedValueType = checkboxPrefix + String.join("/", choices);
            question.setValueType(updatedValueType);
            questionRepository.save(question);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @DeleteMapping("delete-choice/{questionId}/{choiceId}")
    public ResponseEntity<Void> deleteChoiceFromQuestion(
            @PathVariable Long questionId,
            @PathVariable Integer choiceId) {
        try {
            Question question = questionService.getQuestionById(questionId);
            if (question.getValueType() == null || !question.getValueType().startsWith("checkbox/")) {
                return ResponseEntity.badRequest().build();
            }
            String checkboxPrefix = "checkbox/";
            String valueTypeWithoutCheckbox = question.getValueType().substring(checkboxPrefix.length());
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
                    question.setValueType(updatedValueType);
                    questionRepository.save(question);
                    choiceFound = true;
                    break;
                }
            }
            if (!choiceFound) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PostMapping("add-choice-to-question/{questionId}")
    public ResponseEntity<Void> addCheckboxChoiceToQuestion(@PathVariable Long questionId, @RequestBody ChoiceUpdate choiceUpdate) {
        try {
            Question question = questionService.getQuestionById(questionId);
            questionService.addChoice(question, choiceUpdate);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PutMapping("update-choice-question/{questionId}/{choiceId}")
    public ResponseEntity<Void> updateChoiceQuestion(@PathVariable Long questionId, @PathVariable Integer choiceId, @RequestBody ChoiceUpdate choiceUpdate) {
        try {
            Question question = questionService.getQuestionById(questionId);
            questionService.updateChoice(question, choiceId, choiceUpdate);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @DeleteMapping("delete-choice-question/{questionId}/{choiceId}")
    public ResponseEntity<Void> deleteChoiceQuestion(@PathVariable Long questionId, @PathVariable Integer choiceId) {
        try {
            Question question = questionService.getQuestionById(questionId);
            questionService.deleteChoice(question, choiceId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("add-choice-subquestion/{subQuestionId}")
    public ResponseEntity<Void> addChoiceToSubQuestion(@PathVariable Long subQuestionId, @RequestBody ChoiceUpdate choiceUpdate) {
        try {
            SubQuestion subQuestion = subQuestionService.getSubQuestionById(subQuestionId);
            questionService.addChoice(subQuestion, choiceUpdate);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("update-choice-subquestion/{subQuestionId}/{choiceId}")
    public ResponseEntity<Void> updateChoiceSubQuestion(@PathVariable Long subQuestionId, @PathVariable Integer choiceId, @RequestBody ChoiceUpdate choiceUpdate) {
        try {
            SubQuestion subQuestion = subQuestionService.getSubQuestionById(subQuestionId);
            questionService.updateChoice(subQuestion, choiceId, choiceUpdate);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @DeleteMapping("delete-choice-subquestion/{subQuestionId}/{choiceId}")
    public ResponseEntity<Void> deleteChoiceSubQuestion(@PathVariable Long subQuestionId, @PathVariable Integer choiceId) {
        try {
            SubQuestion subQuestion = subQuestionService.getSubQuestionById(subQuestionId);
            questionService.deleteChoice(subQuestion, choiceId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

