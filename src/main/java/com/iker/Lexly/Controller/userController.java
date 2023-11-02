package com.iker.Lexly.Controller;

import com.iker.Lexly.DTO.TemplateDTO;
import com.iker.Lexly.Entity.Template;
import com.iker.Lexly.Transformer.TemplateTransformer;
import com.iker.Lexly.repository.RoleRepository;
import com.iker.Lexly.service.TemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/api/user")
public class userController {
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    TemplateService templateService;
    @Autowired
    TemplateTransformer templateTransformer;
    @GetMapping("/user_all_templates")
    public List<TemplateDTO> getAllTemplates() {
        List<Template> templates = templateService.getAllTemplates();
        List<TemplateDTO> templateDTOs = templates.stream()
                .map(templateTransformer::toDTO)
                .collect(Collectors.toList());
        return templateDTOs;
    }
}
