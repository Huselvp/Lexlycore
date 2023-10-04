package com.iker.Lexly.Controller;

import com.iker.Lexly.DTO.DocsDTO;
import com.iker.Lexly.Entity.Docs;
import com.iker.Lexly.Entity.User;
import com.iker.Lexly.service.DocsService;
import com.iker.Lexly.service.TemplateService;
import com.iker.Lexly.service.userService;
import freemarker.template.TemplateException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/documents")
public class DocsController {
    @Autowired
    private DocsService docsService;
    @PostMapping("/addAttributes/{docsId}")
    public ResponseEntity<String> addAttributesToDocs(@PathVariable Long docsId, @RequestBody Map<String, Object> attributes) {
        try {
            docsService.addAttributesToDocs(docsId, attributes);
            return ResponseEntity.ok("Attributes added to Docs successfully.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding attributes to Docs.");
        }
    }
}
