package com.iker.Lexly.Controller;

import com.iker.Lexly.DTO.TemplateDTO;
import com.iker.Lexly.Entity.Docs;
import freemarker.template.Template;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/docs")
public class adminController {
    @GetMapping("/{userId}/documents")
    public List<Docs> getUserDocuments(@PathVariable Long userId) {
       return null;
    }

    @PostMapping("/{userId}/documents/{documentId}/delete")
    public ResponseEntity<String> deleteDocumentByAdmin(
            @PathVariable Long userId,
            @PathVariable Long documentId) {

        return ResponseEntity.ok("Document deleted by admin.");
    }


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



