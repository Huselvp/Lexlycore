package com.iker.Lexly.Controller;

import com.iker.Lexly.Entity.*;
import com.iker.Lexly.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user/documents")
public class suserController {
    private final DocumentsService documentsService;
    private final UserService userService;
    private final TemplateService templateService;
    private final QuestionService questionService;
    private final TemplateQuestionValueService templateQuestionValueService;

    @Autowired
    public suserController(DocumentsService documentsService, UserService userService, TemplateService templateService, QuestionService questionService, TemplateQuestionValueService templateQuestionValueService) {
        this.documentsService = documentsService;
        this.userService = userService;
        this.templateQuestionValueService = templateQuestionValueService;
        this.questionService = questionService;
        this.templateService = templateService;
    }



}


