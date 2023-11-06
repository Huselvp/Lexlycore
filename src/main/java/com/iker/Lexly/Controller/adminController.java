package com.iker.Lexly.Controller;
import com.iker.Lexly.responses.ApiResponse;
import com.iker.Lexly.DTO.CategoryDTO;
import com.iker.Lexly.DTO.QuestionDTO;
import com.iker.Lexly.DTO.TemplateDTO;
import com.iker.Lexly.DTO.UserDTO;
import com.iker.Lexly.Entity.*;
import com.iker.Lexly.Transformer.CategoryTransformer;
import com.iker.Lexly.Transformer.QuestionTransformer;
import com.iker.Lexly.Transformer.TemplateTransformer;
import com.iker.Lexly.Transformer.UserTransformer;
import com.iker.Lexly.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api/admin")
public class adminController {
    private final UserService userService;
    private final UserTransformer userTransformer;
    private final QuestionTransformer questionTransformer;
    private final CategoryService categoryService;
    @Autowired
    private final TemplateService templateService;
    @Autowired
    private final QuestionService questionService;
    private final TemplateTransformer templateTransformer;
    private final CategoryTransformer categoryTransformer;

    @Autowired
    public adminController(CategoryTransformer categoryTransformer,UserService userService, UserTransformer userTransformer, QuestionTransformer questionTransformer1, TemplateService templateService, CategoryService categoryService, QuestionService questionService, TemplateTransformer templateTransformer) {
        this.templateService = templateService;
        this.userTransformer = userTransformer;
        this.categoryService = categoryService;
        this.questionService = questionService;
        this.categoryTransformer=categoryTransformer;
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

    @DeleteMapping("delete_template/{id}") //valide
    public ResponseEntity<String> deleteTemplate(@PathVariable Long id) {
        Template template = templateService.getTemplateById(id);
        if (template != null) {
            List<Question> questions = template.getQuestions();
            if (!questions.isEmpty()) {
                for (Question question : questions) {
                    questionService.deleteQuestion(question.getId());
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
    @PostMapping("/create_question/{templateId}") // valide
    public ResponseEntity<?> createQuestion(@RequestBody Question question, @PathVariable Long templateId) {
        if (questionService.doesQuestionExist(templateId, question.getQuestionText())) {
            return ResponseEntity.badRequest().body("Question with the same text already exists for this template.");
        }
        Template template = templateService.getTemplateById(templateId);
        if (template != null) {
            question.setTemplate(template);
            Question createdQuestion = questionService.createQuestion(question);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdQuestion);
        } else {
            return ResponseEntity.notFound().build();}
    }

    @GetMapping("/find_questions_by_template/{templateId}") // valide
    public List<QuestionDTO> findQuestionsByTemplateId(@PathVariable Long templateId) {
        List<Question> questions = questionService.findQuestionsByTemplateId(templateId);
        List<QuestionDTO> questionDTOs = questions.stream()
                .map(questionTransformer::toDTO)
                .collect(Collectors.toList());
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
    @GetMapping("/question/{questionId}") //valide
    public ResponseEntity<Question> getQuestionById(@PathVariable Long questionId) {
        Question question = questionService.getQuestionById(questionId);
        if (question != null) {
            return new ResponseEntity<>(question, HttpStatus.OK);
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
    @GetMapping("/category/{categoryId}")//valide
    public ResponseEntity<Category> getCategoryById(@PathVariable Long categoryId) {
        Category category = categoryService.getCategoryById(categoryId);

        if (category != null) {
            return new ResponseEntity<>(category, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @DeleteMapping("/delete_question/{id}") //valide
    public ResponseEntity<String> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.ok("question with ID " + id + " has been deleted successfully.");
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
    @GetMapping("all_categories") //valide
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();

        return ResponseEntity.ok(categories);
    }
}