package com.iker.Lexly.Controller;
import com.iker.Lexly.DTO.QuestionDTO;
import com.iker.Lexly.DTO.TemplateDTO;
import com.iker.Lexly.DTO.UserDTO;
import com.iker.Lexly.Entity.*;
import com.iker.Lexly.Transformer.QuestionTransformer;
import com.iker.Lexly.Transformer.TemplateTransformer;
import com.iker.Lexly.Transformer.UserTransformer;
import com.iker.Lexly.repository.QuestionRepository;
import com.iker.Lexly.repository.TemplateRepository;
import com.iker.Lexly.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class adminController {
private final UserService userService;
    private final UserTransformer userTransformer;

    private final QuestionTransformer questionTransformer;

    private  final QuestionRepository questionRepository;
    private final CategoryService categoryService;
    private final TemplateService templateService;
    private final TemplateQuestionValueService templateQuestionValueService;
    private final QuestionService questionService;
    private final TemplateRepository templateRepository;
    private final TemplateTransformer templateTransformer;



    @Autowired
    public adminController(UserService userService,UserTransformer userTransformer, QuestionTransformer questionTransformer1, TemplateService templateService, CategoryService categoryService , TemplateQuestionValueService templateQuestionValueService, QuestionService questionService, QuestionRepository questionRepository, TemplateRepository templateRepository, TemplateTransformer templateTransformer) {
        this.templateService = templateService;
        this.userTransformer=userTransformer;
        this.templateQuestionValueService=templateQuestionValueService;
        this.templateRepository=templateRepository;
        this.categoryService=categoryService;
        this.questionService=questionService;
        this.questionRepository=questionRepository;
        this.templateTransformer=templateTransformer;
        this.questionTransformer=questionTransformer1;
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
   // @PreAuthorize("hasRole('ADMIN') or hasRole('SUSER')")
    @GetMapping("/all_templates")
    public List<TemplateDTO> getAllTemplates() {
        List<Template> templates = templateService.getAllTemplates();
        List<TemplateDTO> templateDTOs = templates.stream()
                .map(templateTransformer::toDTO)
                .collect(Collectors.toList());
        return templateDTOs;
    }

 //   @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create_template")
    public ResponseEntity<Template> createTemplate(@RequestBody Template template) {
        Template createdTemplate = templateService.createTemplate(template);
        return ResponseEntity.ok(createdTemplate);
    }
  //  @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("update_template/{id}")
    public ResponseEntity<Template> updateTemplate(@PathVariable Long id, @RequestBody Template template) {
        Template updatedTemplate = templateService.updateTemplate(id, template);
        return ResponseEntity.ok(updatedTemplate);
    }
   // @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("delete_template/{id}")
    public ResponseEntity<?> deleteTemplate(@PathVariable Long id) {
        templateService.deleteTemplate(id);
        return ResponseEntity.ok().build();
    }
   // @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create_template_question_text")
    public ResponseEntity<List<TemplateQuestionValue>> createTemplateQuestionValues(
            @RequestBody List<TemplateQuestionValue> templateQuestionValues
    ) {
        List<TemplateQuestionValue> createdValues = new ArrayList<>();
        for (TemplateQuestionValue templateQuestionValue : templateQuestionValues) {
            Long templateId = templateQuestionValue.getTemplate().getId();
            Template fetchedTemplate = templateRepository.findById(templateId).orElse(null);
            if (fetchedTemplate == null) {
                System.err.println("Template with ID " + templateId + " not found.");
                return ResponseEntity.notFound().build();
            }
            String questionText = templateQuestionValue.getQuestion().getQuestionText();
            Question fetchedQuestion = questionRepository.findByQuestionText(questionText);
            if (fetchedQuestion == null) {
                fetchedQuestion = new Question();
                fetchedQuestion.setQuestionText(questionText);
                questionRepository.save(fetchedQuestion);
            }
            templateQuestionValue.setTemplate(fetchedTemplate);
            List<TemplateQuestionValue> questionValues = (List<TemplateQuestionValue>) fetchedQuestion.getTemplateQuestionValues();
            questionValues.add(templateQuestionValue);
            fetchedQuestion.setTemplateQuestionValues((Set<TemplateQuestionValue>) questionValues);

            createdValues.add(templateQuestionValue);
        }

        createdValues = templateQuestionValueService.createTemplateQuestionValues(createdValues);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdValues);
    }
   // @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update_template_question_value/{id}")
    public ResponseEntity<TemplateQuestionValue> updateTemplateQuestionValue(
            @PathVariable Long id,
            @RequestBody TemplateQuestionValue updatedTemplateQuestionValue
    ) {
        TemplateQuestionValue updatedValue = templateQuestionValueService.updateTemplateQuestionValue(id, updatedTemplateQuestionValue);
        return ResponseEntity.ok(updatedValue);
    }
  //  @PreAuthorize("hasRole('ADMIN')")
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
   // @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update_question/{id}")
    public ResponseEntity<Question> updateQuestion(
            @PathVariable Long id,
            @RequestBody Question updatedQuestion
    ) {
        Question updatedQues = questionService.updateQuestion(id, updatedQuestion);
        return ResponseEntity.ok(updatedQues);
    }
  //  @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete_question/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
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
   // @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("delete_category/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.noContent().build();
    }
   // @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("all_categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

}


