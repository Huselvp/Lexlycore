package com.iker.Lexly.Controller;

import com.iker.Lexly.DTO.DocsDTO;
import com.iker.Lexly.Entity.Docs;
import com.iker.Lexly.Entity.User;
import com.iker.Lexly.service.DocsService;
import com.iker.Lexly.service.TemplateService;
import freemarker.template.TemplateException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;


@RestController
@RequestMapping("/documents")
public class DocsController {
    private final DocsService docsService;
    private TemplateService templateService;

    @Autowired
    public DocsController(DocsService docsService,TemplateService templateService) {
        this.docsService = docsService;
        this.templateService=templateService;
    }
    @GetMapping("/template/{templateName}")
    public ResponseEntity<String> getTemplate(@PathVariable String templateName) {
        try {
            String templateContent = templateService.fetchTemplateContent(templateName);
            return ResponseEntity.ok(templateContent);
        } catch (IOException | TemplateException e) {
            // Handle exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error loading template");
        }
    }
    @PostMapping("/update-data")
    public ResponseEntity<String> updateDocumentData(@RequestBody DocsDTO docsDTO) {
      Docs document = docsService.getDocumentByUserIdAndTemplate(docsDTO.getUserId(), docsDTO.getTemplateId());
       document.setFirstName(docsDTO.getFirstName());
      document.setLastName(docsDTO.getLastName());
       docsService.updateDocument(document);
        return ResponseEntity.ok("Document data updated successfully.");
    }
    @PostMapping("/save")
    public ResponseEntity<String> saveDocumentData(@RequestBody DocsDTO dataRequest) {
       Docs document = docsService.getDocumentByUserIdAndTemplate(dataRequest.getUserId(), dataRequest.getTemplateId());
        document.setFirstName(dataRequest.getFirstName());
        document.setLastName(dataRequest.getLastName());
        docsService.updateDocument(document);
        return ResponseEntity.ok("Document data saved successfully.");
    }

}
