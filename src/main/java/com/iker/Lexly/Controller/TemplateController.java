package com.iker.Lexly.Controller;

import com.iker.Lexly.DTO.TemplateDTO;
import com.iker.Lexly.Entity.Template;
import com.iker.Lexly.Transformer.TemplateTransformer;
import com.iker.Lexly.service.TemplateService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/template")
public class TemplateController {
    private  final TemplateService templateService;
    private final TemplateTransformer templateTransformer;
    public TemplateController(TemplateService templateService, TemplateTransformer templateTransformer) {
        this.templateService = templateService;
        this.templateTransformer = templateTransformer;
    }

    @GetMapping("/all_templates")
    public List<TemplateDTO> getAllTemplates() {
        List<Template> templates = templateService.getAllTemplates();
        List<TemplateDTO> templateDTOs = templates.stream()
                .map(templateTransformer::toDTO)
                .collect(Collectors.toList());
        return templateDTOs;
    }
}
