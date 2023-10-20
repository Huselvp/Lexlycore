package com.iker.Lexly.Controller;
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
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api/admin")
public class adminController {
    private final UserService userService;
    private final UserTransformer userTransformer;
    private final QuestionTransformer questionTransformer;
    private final QuestionRepository questionRepository;
    private final CategoryService categoryService;
    private final TemplateService templateService;

    private final QuestionService questionService;
    private final TemplateRepository templateRepository;
    private final TemplateTransformer templateTransformer;
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
    //@PreAuthorize("hasRole('ADMIN')")
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
    //  @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update/{templateId}")
    public ResponseEntity<Template> updateTemplate(
            @PathVariable Long templateId,
            @RequestBody Template updatedTemplate) {
        Template updated = templateService.updateTemplate(templateId, updatedTemplate);
        if (updated != null) {
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    // @PreAuthorize("hasRole('ADMIN')")
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
    // @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create_question")
    public ResponseEntity<Question> createQuestion(@RequestBody Question question) {
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

    // @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update_question/{id}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long id, @RequestBody Question question) {
        Question updatedQuestion = questionService.updateQuestion(id, question.getQuestionText(), question.getValueType());
        if (updatedQuestion != null) {
            return new ResponseEntity<>(updatedQuestion, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
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
    //  @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete_question/{id}")
    public ResponseEntity<String> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.ok("question with ID " + id + " has been deleted successfully.");
    }

    //  @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add_category")
    public ResponseEntity<Category> addCategory(@Valid @RequestBody Category category) {
        Category newCategory = categoryService.addCategory(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(newCategory);
    }

    // @PreAuthorize("hasRole('ADMIN')")
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
  //  @PreAuthorize("hasRole('ADMIN')")
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
    // @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("all_categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

}


