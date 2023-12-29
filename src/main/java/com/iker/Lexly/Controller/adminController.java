package com.iker.Lexly.Controller;
import com.iker.Lexly.DTO.*;
import com.iker.Lexly.Entity.*;
import com.iker.Lexly.Transformer.CategoryTransformer;
import com.iker.Lexly.config.jwt.JwtService;
import com.iker.Lexly.repository.QuestionRepository;
import com.iker.Lexly.repository.TemplateRepository;
import com.iker.Lexly.repository.UserRepository;
import com.iker.Lexly.request.ChoiceUpdate;
import com.iker.Lexly.request.UpdateEmailPassword;
import com.iker.Lexly.responses.ApiResponse;
import com.iker.Lexly.Transformer.QuestionTransformer;
import com.iker.Lexly.Transformer.TemplateTransformer;
import com.iker.Lexly.Transformer.UserTransformer;

import com.iker.Lexly.service.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')")

public class adminController {
    private final UserService userService;
    private final UserTransformer userTransformer;
    private final UserRepository userRepository;
    private  final PasswordEncoder passwordEncoder;
    private final QuestionTransformer questionTransformer;
    private final CategoryService categoryService;
    private final QuestionRepository questionRepository;
    private final TemplateRepository templateRepository;
    @Autowired
    private final TemplateService templateService;
    @Autowired
    private final QuestionService questionService;
    private final TemplateTransformer templateTransformer;
    private final CategoryTransformer categoryTransformer;
    private final JwtService jwtService;

    @Autowired
    public adminController(UserRepository userRepository, PasswordEncoder passwordEncoder,JwtService jwtService ,TemplateRepository templateRepository, QuestionRepository questionRepository, DocumentsService documentsService, CategoryTransformer categoryTransformer, UserService userService, UserTransformer userTransformer, QuestionTransformer questionTransformer1, TemplateService templateService, CategoryService categoryService, QuestionService questionService, TemplateTransformer templateTransformer) {
        this.templateService = templateService;
        this.jwtService=jwtService;
        this.passwordEncoder=passwordEncoder;
        this.userRepository=userRepository;
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
    @GetMapping("/all_users")
    public List<UserDTO> getAllUsers(HttpServletRequest request) {
        List<User> users = userService.getAllUsers();
        List<UserDTO> userDTOs = users.stream()
                .map(userTransformer::toDTO)
                .collect(Collectors.toList());
        return userDTOs;
    }
    @PreAuthorize("(hasRole('ROLE_ADMIN') or hasRole('ROLE_SUSER'))")
    @GetMapping("/getMe")
    public ResponseEntity<User> getUserByToken(HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        if (jwtService.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        String username = jwtService.extractUsername(token);
        if (username != null) {
            Optional<User> optionalUser = userRepository.findByUsername(username);
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                return ResponseEntity.ok(user);
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }
    @DeleteMapping("/delete_user/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("question with ID " + id + " has been deleted successfully.");
    }

    @PutMapping("/update_user")
    public ResponseEntity<User> updateUser(HttpServletRequest request, @RequestBody User updatedUser) throws ChangeSetPersister.NotFoundException {
        String token = extractTokenFromRequest(request);
        User updatedUserResponse = userService.updateUser(token, updatedUser);
        return new ResponseEntity<>(updatedUserResponse, HttpStatus.OK);
    }
    @PatchMapping("/updateEMailOrPassword")
    public ResponseEntity<String> modifyEmailOrPassword(
            HttpServletRequest request,
            @RequestBody UpdateEmailPassword updateRequest) {
        String token = extractTokenFromRequest(request);
        if (jwtService.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token expired");
        }
        String username = jwtService.extractUsername(token);
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (passwordEncoder.matches(updateRequest.getCurrentPassword(), user.getPassword())) {
                if (updateRequest.getEmail() != null) {
                    if (userRepository.existsUserByEmail(updateRequest.getEmail())) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The updated email is already in use.");
                    }
                    user.setEmail(updateRequest.getEmail());
                }
                if (updateRequest.getNewPassword() != null) {
                    user.setPassword(passwordEncoder.encode(updateRequest.getNewPassword()));
                }
                userRepository.save(user);
                return ResponseEntity.ok("User information updated successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid current password.");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
    }
    @PreAuthorize("(hasRole('ROLE_ADMIN') or hasRole('ROLE_SUSER'))")
    @GetMapping("/all_templates")
    public List<Template> getAllTemplates() {
        List<Template> templates = templateService.getAllTemplates();
        return templates;
    }

    @PostMapping(value = "/create_template")
    public ResponseEntity<Template> createTemplate(@RequestBody TemplateDTO templateDTO) {
            Template createdTemplate = templateService.createTemplate(templateDTO);
            return ResponseEntity.ok(createdTemplate);

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

    @PutMapping("/update_category/{categoryId}")
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
    @PreAuthorize("(hasRole('ROLE_ADMIN') or hasRole('ROLE_SUSER'))")
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
    @PreAuthorize("(hasRole('ROLE_ADMIN') or hasRole('ROLE_SUSER'))")
    @GetMapping("/template/{templateId}")
    public ResponseEntity<Template> getTemplateById(@PathVariable Long templateId) {
        Template template = templateService.getTemplateById(templateId);
            return new ResponseEntity<>(template, HttpStatus.OK);
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
    private String extractTokenFromRequest(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7);
        }
        return null;
    }

}

