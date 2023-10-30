package com.iker.Lexly.Controller;
import com.iker.Lexly.ApiResponse;
import com.iker.Lexly.DTO.CategoryDTO;
import com.iker.Lexly.DTO.QuestionDTO;
import com.iker.Lexly.DTO.TemplateDTO;
import com.iker.Lexly.DTO.UserDTO;
import com.iker.Lexly.Entity.*;
import com.iker.Lexly.Transformer.QuestionTransformer;
import com.iker.Lexly.Transformer.TemplateTransformer;
import com.iker.Lexly.Transformer.UserTransformer;
import com.iker.Lexly.repository.CategoryRepository;
import com.iker.Lexly.repository.QuestionRepository;
import com.iker.Lexly.repository.TemplateRepository;
import com.iker.Lexly.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api/admin")
public class adminController {
    private final UserService userService;
    private final UserTransformer userTransformer;
    private final QuestionTransformer questionTransformer;
    @Autowired
    private final QuestionRepository questionRepository;
    private final CategoryService categoryService;
    @Autowired
    private final TemplateService templateService;
    @Autowired
    private final QuestionService questionService;
    @Autowired
    private final TemplateRepository templateRepository;
    private final TemplateTransformer templateTransformer;
    @Autowired
    private final CategoryRepository categoryRepository;
    @Autowired
    public adminController(CategoryRepository categoryRepository,UserService userService, UserTransformer userTransformer, QuestionTransformer questionTransformer1, TemplateService templateService, CategoryService categoryService, QuestionService questionService, QuestionRepository questionRepository, TemplateRepository templateRepository, TemplateTransformer templateTransformer) {
        this.templateService = templateService;
        this.userTransformer = userTransformer;
        this.categoryRepository=categoryRepository;
        this.templateRepository = templateRepository;
        this.categoryService = categoryService;
        this.questionService = questionService;
        this.questionRepository = questionRepository;
        this.templateTransformer = templateTransformer;
        this.questionTransformer = questionTransformer1;
        this.userService = userService;
    }
    @GetMapping("/all_users")
    public List<UserDTO> getAllUsers() {
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
    @PutMapping("update_user/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable Long userId, @RequestBody User updatedUser) throws ChangeSetPersister.NotFoundException {
        User updatedUserResponse = userService.updateUser(userId, updatedUser);
        return new ResponseEntity<>(updatedUserResponse, HttpStatus.OK);
    }
    // @PreAuthorize("hasRole('ADMIN') or hasRole('SUSER')")
    @GetMapping("/all_templates")
    public List<TemplateDTO> getAllTemplates() {
        List<Template> templates = templateService.getAllTemplates();
        List<TemplateDTO> templateDTOs = templates.stream()
                .map(templateTransformer::toDTO)
                .collect(Collectors.toList());
        return templateDTOs;
    }
    @PostMapping(value = "/create_template")
    public ResponseEntity<Template> createTemplate(@RequestBody Template template) {
        Template createdTemplate = templateService.createTemplate(template);
        return ResponseEntity.ok(createdTemplate);
    }
    @PutMapping("/update/{templateId}")
    public ResponseEntity<Template> updateTemplate(
            @PathVariable Long templateId,
            @RequestBody Template updatedFields) {
        Template updated = templateService.updateTemplate(templateId, updatedFields);
        if (updated != null) {
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @PutMapping("/updateCategory/{templateId}")
    public ResponseEntity<TemplateDTO> updateCategory(
            @PathVariable Long templateId,
            @RequestBody CategoryDTO updatedCategoryDTO) {
        TemplateDTO updatedTemplate = templateService.updateCategory(templateId, updatedCategoryDTO);
        if (updatedTemplate != null) {
            return new ResponseEntity<>(updatedTemplate, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @DeleteMapping("delete_template/{id}")
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
    @GetMapping("/all_questions")
    public List<QuestionDTO> getAllQuestions() {
        List<Question> questions = questionService.getAllQuestions();
        List<QuestionDTO> questionDTOs = questions.stream()
                .map(questionTransformer::toDTO)
                .collect(Collectors.toList());
        return questionDTOs;
    }
    @PostMapping("/create_question/{templateId}")
    public ResponseEntity<Question> createQuestion(
            @RequestBody QuestionDTO questionDTO,
            @PathVariable Long templateId
    ) {
        Question question = new Question();
        question.setQuestionText(questionDTO.getQuestionText());
        question.setDescription(questionDTO.getDescription());
        question.setDescriptionDetails(questionDTO.getDescriptionDetails());
        question.setValueType(questionDTO.getValueType());
        question.setTexte(questionDTO.getTexte());
        Template template = templateService.getTemplateById(templateId);
        question.setTemplate(template);
        Question createdQuestion = questionService.createQuestion(question);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdQuestion);
    }
    @GetMapping("/find_questions_by_template/{templateId}")
    public List<QuestionDTO> findQuestionsByTemplateId(@PathVariable Long templateId) {
        List<Question> questions = questionService.findQuestionsByTemplateId(templateId);
        List<QuestionDTO> questionDTOs = questions.stream()
                .map(questionTransformer::toDTO)
                .collect(Collectors.toList());
        return questionDTOs;
    }
    @PutMapping("/update_question/{id}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long id, @RequestBody Question question) {
        Question updatedQuestion = questionService.updateQuestion(id, question.getQuestionText(), question.getValueType());
        if (updatedQuestion != null) {
            return new ResponseEntity<>(updatedQuestion, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);}
    }
    @GetMapping("/questions/{questionId}")
    public ResponseEntity<Question> getQuestionById(@PathVariable Long questionId) {
        Question question = questionService.getQuestionById(questionId);
        if (question != null) {
            return new ResponseEntity<>(question, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/templates/{templateId}")
    public ResponseEntity<Template> getTemplateById(@PathVariable Long templateId) {
        Template template = templateService.getTemplateById(templateId);

        if (template != null) {
            return new ResponseEntity<>(template, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/categories/{categoryId}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long categoryId) {
        Category category = categoryService.getCategoryById(categoryId);

        if (category != null) {
            return new ResponseEntity<>(category, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @DeleteMapping("/delete_question/{id}")
    public ResponseEntity<String> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.ok("question with ID " + id + " has been deleted successfully.");
    }
    @PostMapping("/add_category")
    public ResponseEntity<Category> addCategory(@Valid @RequestBody Category category) {
        Category newCategory = categoryService.addCategory(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(newCategory);
    }
    @PutMapping("update_category/{categoryId}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable Long categoryId,
            @Valid @RequestBody Category updatedCategory
    ) {
        Category category = categoryService.updateCategory(categoryId, updatedCategory);
        if (category != null) {
            return ResponseEntity.ok(category);
        }
        return ResponseEntity.notFound().build();
    }
    @PostMapping("/assignCategory/{templateId}/{categoryId}")
    public ApiResponse assignCategoryToTemplate(@PathVariable Long templateId, @PathVariable Long categoryId) {
        return templateService.assignCategoryToTemplate(templateId, categoryId);
    }
    @DeleteMapping("delete_category/{categoryId}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.ok("Category with ID " + categoryId + " has been deleted successfully.");
    }
    @DeleteMapping("delete_category_and_template/{categoryId}")
    public ResponseEntity<String> deleteCategoryAndTemplates(@PathVariable Long categoryId) {
        categoryService.deleteCategoryAndTemplates(categoryId);
        return ResponseEntity.ok("Category and associated templates deleted successfully.");
    }
    @GetMapping("all_categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }
}