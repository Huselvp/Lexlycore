package com.iker.Lexly.Controller;
import com.iker.Lexly.DTO.*;
import com.iker.Lexly.Entity.*;
import com.iker.Lexly.Transformer.CategoryTransformer;
import com.iker.Lexly.repository.ChoicesRelatedTexteRepository;
import com.iker.Lexly.repository.QuestionRepository;
import com.iker.Lexly.repository.TemplateRepository;
import com.iker.Lexly.request.ChoiceUpdate;
import com.iker.Lexly.request.QuestionWithChoicesRequest;
import com.iker.Lexly.responses.ApiResponse;
import com.iker.Lexly.Transformer.QuestionTransformer;
import com.iker.Lexly.Transformer.TemplateTransformer;
import com.iker.Lexly.Transformer.UserTransformer;

import com.iker.Lexly.service.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api/admin")
public class adminController {
    @PersistenceContext
    private EntityManager entityManager;
    private final UserService userService;
    private final UserTransformer userTransformer;
    private final QuestionTransformer questionTransformer;
    private final CategoryService categoryService;
    private final ChoiceRelatedTextePairsService choiceRelatedTextePairsService;
    private final ChoicesRelatedTexteRepository choicesRelatedTexteRepository;
    private final QuestionRepository questionRepository;
    private final TemplateRepository templateRepository;
    @Autowired
    private final TemplateService templateService;
    @Autowired
    private final QuestionService questionService;
    private final TemplateTransformer templateTransformer;
    private final CategoryTransformer categoryTransformer;

    @Autowired
    public adminController(ChoicesRelatedTexteRepository choicesRelatedTexteRepository, ChoiceRelatedTextePairsService choiceRelatedTextePairsService, TemplateRepository templateRepository, QuestionRepository questionRepository, DocumentsService documentsService, CategoryTransformer categoryTransformer, UserService userService, UserTransformer userTransformer, QuestionTransformer questionTransformer1, TemplateService templateService, CategoryService categoryService, QuestionService questionService, TemplateTransformer templateTransformer) {
        this.templateService = templateService;
        this.choicesRelatedTexteRepository = choicesRelatedTexteRepository;
        this.choiceRelatedTextePairsService = choiceRelatedTextePairsService;
        this.questionRepository = questionRepository;
        this.templateRepository = templateRepository;
        this.userTransformer = userTransformer;
        this.categoryService = categoryService;
        this.questionService = questionService;
        this.categoryTransformer = categoryTransformer;
        this.templateTransformer = templateTransformer;
        this.questionTransformer = questionTransformer1;
        this.userService = userService;
    }

    @GetMapping("/all_users") //valide
    public List<UserDTO> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserDTO> userDTOs = users.stream()
                .map(userTransformer::toDTO)
                .collect(Collectors.toList());
        return userDTOs;
    }

    @DeleteMapping("/delete_user/{id}") //valide
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("question with ID " + id + " has been deleted successfully.");
    }

    @PutMapping("update_user/{userId}") //valide
    public ResponseEntity<User> updateUser(@PathVariable Long userId, @RequestBody User updatedUser) throws ChangeSetPersister.NotFoundException {
        User updatedUserResponse = userService.updateUser(userId, updatedUser);
        return new ResponseEntity<>(updatedUserResponse, HttpStatus.OK);
    }

    // @PreAuthorize("hasRole('ADMIN') or hasRole('SUSER')")
    @GetMapping("/all_templates") // valide
    public List<TemplateDTO> getAllTemplates() {
        List<Template> templates = templateService.getAllTemplates();
        List<TemplateDTO> templateDTOs = templates.stream()
                .map(templateTransformer::toDTO)
                .collect(Collectors.toList());
        return templateDTOs;
    }

    @PostMapping(value = "/create_template")//valide
    public ResponseEntity<Template> createTemplate(@RequestBody Template template) {
        Template createdTemplate = templateService.createTemplate(template);
        return ResponseEntity.ok(createdTemplate);
    }

    @PutMapping("/update_template/{templateId}")//valid
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

    @PutMapping("/update_category/{categoryId}")//valid
    public ResponseEntity<CategoryDTO> updateCategory(
            @PathVariable Long categoryId,
            @RequestBody CategoryDTO updateRequest
    ) {
        Category updatedCategory = categoryService.updateCategory(categoryId, updateRequest);
        if (updatedCategory != null) {
            CategoryDTO updatedCategoryDTO = categoryTransformer.toDTO(updatedCategory);
            return new ResponseEntity<>(updatedCategoryDTO, HttpStatus.OK);
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

    @GetMapping("/all_questions") // valide
    public List<QuestionDTO> getAllQuestions() {
        List<Question> questions = questionService.getAllQuestions();
        List<QuestionDTO> questionDTOs = questions.stream()
                .map(questionTransformer::toDTO)
                .collect(Collectors.toList());
        return questionDTOs;
    }

    @PostMapping("/create_question/{templateId}")
    public ResponseEntity<Question> createQuestion(
            @PathVariable Long templateId,
            @RequestBody Question request) {
        Template template = templateRepository.findById(templateId)
                .orElseThrow(() -> new RuntimeException("Template not found"));
        Question question = questionService.createQuestion(request, template);
        return ResponseEntity.ok(question);
    }

    @GetMapping("/find_questions_by_template/{templateId}")
    public List<QuestionDTO> findQuestionsByTemplateId(@PathVariable Long templateId) {
        List<QuestionDTO> questionDTOs = questionService.findQuestionsByTemplateId(templateId);
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

    @GetMapping("question/{questionId}")
    public ResponseEntity<QuestionDTO> getQuestionById(@PathVariable Long questionId) {
        Question question = questionService.getQuestionById(questionId);
        if (question != null) {
            QuestionDTO questionDTO = questionTransformer.toDTO(question);
            return new ResponseEntity<>(questionDTO, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/template/{templateId}")
    public ResponseEntity<TemplateDTO> getTemplateById(@PathVariable Long templateId) {
        TemplateDTO templateDTO = templateService.getTemplateDTOById(templateId);

        if (templateDTO != null) {
            return new ResponseEntity<>(templateDTO, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long categoryId) {
        Category category = categoryService.getCategoryById(categoryId);
        if (category != null) {
            return new ResponseEntity<>(category, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/delete_question_with_choices/{id}")
    public ResponseEntity<String> deleteQuestionWithChoices(@PathVariable Long id) {
        choiceRelatedTextePairsService.deleteChoicesByQuestionId(id);
        questionService.deleteQuestion(id);
        return ResponseEntity.ok("Question with ID " + id + " and its choices have been deleted successfully.");
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

    @PostMapping("/add_category") // valide
    public ResponseEntity<Category> addCategory(@Valid @RequestBody Category category) {
        Category newCategory = categoryService.addCategory(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(newCategory);
    }

    @PostMapping("/assignCategory/{templateId}/{categoryId}")//valide
    public ApiResponse assignCategoryToTemplate(@PathVariable Long templateId, @PathVariable Long categoryId) {
        return templateService.assignCategoryToTemplate(templateId, categoryId);
    }

    @DeleteMapping("/delete_category/{categoryId}") //valide
    public ResponseEntity<String> deleteCategory(@PathVariable Long categoryId) {
        String deletionMessage = categoryService.deleteCategory(categoryId);

        if (deletionMessage != null) {
            return ResponseEntity.ok(deletionMessage);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("all_categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();

        return ResponseEntity.ok(categories);
    }

    @PostMapping("add-choice-question/{questionId}")
    public ResponseEntity<Void> addChoiceToQuestion(
            @PathVariable Long questionId,
            @RequestBody ChoiceUpdate choiceUpdate) {
        Question question = questionService.getQuestionById(questionId);
        if (question.getValueType() == null || !question.getValueType().startsWith("checkbox")) {
            return ResponseEntity.badRequest().build();
        }

        String[] choices = question.getValueType().split("/");
        int maxChoiceId = 0;

        // Find the maximum choiceId in existing choices
        for (int i = 1; i < choices.length; i += 2) {
            int currentChoiceId = Integer.parseInt(choices[i]);
            maxChoiceId = Math.max(maxChoiceId, currentChoiceId);
        }

        // Increment the choiceId for the new choice
        int newChoiceId = maxChoiceId + 1;

        String newChoice = newChoiceId + "/" + choiceUpdate.getNewRelatedText();
        question.setValueType(question.getValueType() + "/" + newChoice);
        questionRepository.save(question);

        return ResponseEntity.ok().build();
    }


    @PostMapping("update-choice-question/{questionId}")
    public ResponseEntity<Void> updateChoiceInQuestion(
            @PathVariable Long questionId,
            @RequestBody ChoiceUpdate choiceUpdateDTO) {
        int choiceId = choiceUpdateDTO.getChoiceId();
        String newRelatedText = choiceUpdateDTO.getNewRelatedText();
        Question question = questionService.getQuestionById(questionId);
        if (question.getValueType() == null || !question.getValueType().startsWith("checkbox/")) {
            return ResponseEntity.badRequest().build();
        }
        String[] choices = question.getValueType().split("/");
        int index = -1;
        for (int i = 1; i < choices.length; i += 2) {
            if (Integer.parseInt(choices[i]) == choiceId) {
                index = i;
                break;
            }
        }
        if (index != -1 && index + 1 < choices.length) {
            choices[index + 1] = newRelatedText;
            question.setValueType(String.join("/", choices));
            questionRepository.save(question);
        }
        return ResponseEntity.ok().build();
    }
    @DeleteMapping("delete-choice-question/{questionId}/{choiceId}")
    public ResponseEntity<Void> deleteChoiceInQuestion(
            @PathVariable Long questionId,
            @PathVariable int choiceId) {
        Question question = questionService.getQuestionById(questionId);
        if (question.getValueType() == null || !question.getValueType().startsWith("checkbox")) {
            return ResponseEntity.badRequest().build();
        }
        String[] choices = question.getValueType().split("/");
        List<String> updatedChoices = new ArrayList<>();
        for (int i = 1; i < choices.length; i += 2) {
            String currentChoiceIdStr = choices[i - 1];
            if (!currentChoiceIdStr.equals("checkbox") && Integer.parseInt(currentChoiceIdStr) != choiceId) {
                updatedChoices.add(currentChoiceIdStr);
                updatedChoices.add(choices[i]);
            }
        }
        question.setValueType("checkbox/" + String.join("/", updatedChoices));
        questionRepository.save(question);

        return ResponseEntity.ok().build();
    }



}

