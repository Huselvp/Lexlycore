package com.iker.Lexly.Controller;

import com.iker.Lexly.service.TemplateService;
import freemarker.template.Template;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/templates")
public class TemplateController {
    private final TemplateService templateService;

    @Autowired
    public TemplateController(TemplateService templateService) {
        this.templateService = templateService;
    }

    @GetMapping("/All")
    public List<Template> getAllTemplates() {
        return templateService.getAllTemplates();
    }

    @GetMapping("/{id}")
    public Optional<Template> getTemplateById(@PathVariable Long id) {
        return templateService.getTemplateById(id);
    }

    @GetMapping("/name/{name}")
    public Optional<Template> getTemplateByName(@PathVariable String name) {
        return templateService.getTemplateByName(name);
    }

    @PostMapping("/create")
    public Template createTemplate(@RequestBody Template template) {
        return templateService.createTemplate(template);
    }
}

