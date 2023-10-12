package com.iker.Lexly.Controller;
import com.iker.Lexly.Entity.Category;
import com.iker.Lexly.Entity.Question;
import com.iker.Lexly.Entity.Template;
import com.iker.Lexly.Entity.TemplateQuestionValue;
import com.iker.Lexly.repository.QuestionRepository;
import com.iker.Lexly.repository.TemplateRepository;
import com.iker.Lexly.service.CategoryService;
import com.iker.Lexly.service.QuestionService;
import com.iker.Lexly.service.TemplateQuestionValueService;
import com.iker.Lexly.service.TemplateService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
@RestController
@RequestMapping("/api/admin")
public class adminController {
    private  final QuestionRepository questionRepository;
    private final CategoryService categoryService;
    private final TemplateService templateService;
    private final TemplateQuestionValueService templateQuestionValueService;
    private final QuestionService questionService;
    private final TemplateRepository templateRepository;

    @Autowired
    public adminController(TemplateService templateService,CategoryService categoryService , TemplateQuestionValueService templateQuestionValueService, QuestionService questionService, QuestionRepository questionRepository,TemplateRepository templateRepository) {
        this.templateService = templateService;
        this.templateQuestionValueService=templateQuestionValueService;
        this.templateRepository=templateRepository;
        this.categoryService=categoryService;
        this.questionService=questionService;
        this.questionRepository=questionRepository;
    }
    @PostMapping("/create_template")
    public ResponseEntity<Template> createTemplate(@RequestBody Template template) {
        Template createdTemplate = templateService.createTemplate(template);
        return ResponseEntity.ok(createdTemplate);
    }

    @PutMapping("update_template/{id}")
    public ResponseEntity<Template> updateTemplate(@PathVariable Long id, @RequestBody Template template) {
        Template updatedTemplate = templateService.updateTemplate(id, template);
        return ResponseEntity.ok(updatedTemplate);
    }

    @DeleteMapping("delete_template/{id}")
    public ResponseEntity<?> deleteTemplate(@PathVariable Long id) {
        templateService.deleteTemplate(id);
        return ResponseEntity.ok().build();
    }
    @PostMapping("/create_template_question_values")
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
            List<TemplateQuestionValue> questionValues = fetchedQuestion.getTemplateQuestionValue();
            questionValues.add(templateQuestionValue);
            fetchedQuestion.setTemplateQuestionValue(questionValues);

            createdValues.add(templateQuestionValue);
        }

        createdValues = templateQuestionValueService.createTemplateQuestionValues(createdValues);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdValues);
    }

    @PutMapping("/update_template_question_value/{id}")
    public ResponseEntity<TemplateQuestionValue> updateTemplateQuestionValue(
            @PathVariable Long id,
            @RequestBody TemplateQuestionValue updatedTemplateQuestionValue
    ) {
        TemplateQuestionValue updatedValue = templateQuestionValueService.updateTemplateQuestionValue(id, updatedTemplateQuestionValue);
        return ResponseEntity.ok(updatedValue);
    }
    @PostMapping("/create_question")
    public ResponseEntity<Question> createQuestion(@RequestBody Question question) {
        Question createdQuestion = questionService.createQuestion(question);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdQuestion);
    }
    @PutMapping("/update_question/{id}")
    public ResponseEntity<Question> updateQuestion(
            @PathVariable Long id,
            @RequestBody Question updatedQuestion
    ) {
        Question updatedQues = questionService.updateQuestion(id, updatedQuestion);
        return ResponseEntity.ok(updatedQues);
    }
    @DeleteMapping("/delete_question/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
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
    @DeleteMapping("delete_category/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("All_categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

}



