package com.iker.Lexly.Controller;

import freemarker.template.Template;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/superadmin/docs")
public class superadminController {
    @GetMapping("/templates")
    public List<Template> getAllTemplates() {
      return null;
    }

    @PostMapping("/templates")
    public ResponseEntity<String> createTemplate(
            @RequestBody TemplateDTO templateDTO) {
        return ResponseEntity.ok("Template created successfully.");
    }

    @PutMapping("/templates/{templateId}")
    public ResponseEntity<String> updateTemplate(
            @PathVariable Long templateId,
            @RequestBody TemplateDTO templateDTO) {
        return ResponseEntity.ok("Template updated successfully.");
    }

    @DeleteMapping("/templates/{templateId}")
    public ResponseEntity<String> deleteTemplate(
            @PathVariable Long templateId) {
        return ResponseEntity.ok("Template deleted successfully.");
    }
}