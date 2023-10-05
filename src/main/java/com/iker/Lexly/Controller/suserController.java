package com.iker.Lexly.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user/docs")
public class suserController {
    @GetMapping("/{userId}/documents")
  //  public List<Docs> getUserDocuments(@PathVariable Long userId) {
  //  return null;
  //  }
    @PostMapping("/{userId}/documents")
    public ResponseEntity<String> createUserDocument(
            @PathVariable Long userId,
            @RequestBody DocsDTO docsDTO) {
        return ResponseEntity.ok("Document created successfully.");
    }

    @PutMapping("/{userId}/documents/{documentId}")
    public ResponseEntity<String> updateUserDocument(
            @PathVariable Long userId,
            @PathVariable Long documentId,
            @RequestBody DocsDTO docsDTO) {
        return ResponseEntity.ok("Document updated successfully.");
    }

    @PostMapping("/{userId}/documents/{documentId}/save")
    public ResponseEntity<String> saveDocumentProgress(
            @PathVariable Long userId,
            @PathVariable Long documentId,
            @RequestBody DocsDTO docsDTO) {
        return ResponseEntity.ok("Document progress saved.");
    }
}