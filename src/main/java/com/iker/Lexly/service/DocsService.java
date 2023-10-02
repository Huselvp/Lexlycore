package com.iker.Lexly.service;
import com.iker.Lexly.DTO.DocsDTO;
import com.iker.Lexly.Entity.Docs;
import com.iker.Lexly.Entity.Role;
import com.iker.Lexly.Entity.User;
import com.iker.Lexly.Entity.enums.ERole;
import com.iker.Lexly.Exceptions.DocumentNotFoundException;
import com.iker.Lexly.Exceptions.UnauthorizedAccessException;
import com.iker.Lexly.repository.DocsRepository;
import com.iker.Lexly.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.Set;
@Service
public class DocsService {
    private final DocsRepository documentRepository;
private final UserRepository userRepository;
    @Autowired
    public DocsService(DocsRepository documentRepository, UserRepository userRepository) {
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
    }

    public List<Docs> getUserDocuments(Long userId) {
        return documentRepository.findByUserUserId(userId);
    }
    public Optional<Docs> getDocumentById(Long id) {
        return documentRepository.findById(id);
    }

    public List<Docs> getAllDocuments() {
        return documentRepository.findAll();
    }



    public void deleteDocument(Long id) {
        documentRepository.deleteById(id);
    }

    public List<Docs> getDocumentsByUserEmail(String userEmail) {
        return documentRepository.findByUserEmail(userEmail);
    }

    public Docs getDocumentByUserIdAndId(Long userId, Long documentId) {
        return documentRepository.findByUserUserIdAndId(userId, documentId);
    }


    public void updateDocument(Docs document) {
        Docs existingDocument = documentRepository.findById(document.getId())
                .orElseThrow(() -> new DocumentNotFoundException("Document not found."));
        existingDocument.setFirstName(document.getFirstName());
        existingDocument.setLastName(document.getLastName());
        documentRepository.save(existingDocument);
    }

    public Docs getDocumentByUserIdAndTemplate(Long userId, Long templateId) {
        return documentRepository.findByUserUserIdAndTemplateId(userId, templateId);
    }
    public void deleteDocumentByAdmin(Long userId, Long documentId) {
        if (!userHasAdminRole(userId)) {
            throw new UnauthorizedAccessException("Only admins can delete documents.");
        }
        Docs documentToDelete = documentRepository.findByUserUserIdAndId(userId, documentId);
        if (documentToDelete == null) {
            throw new DocumentNotFoundException("Document not found or doesn't belong to the user.");
        }
        documentRepository.delete(documentToDelete);
    }

    public void saveDocumentProgress(Long userId, Long documentId, DocsDTO docsDTO) {
        Docs document = documentRepository.findByUserUserIdAndId(userId, documentId);
        if (document == null) {
            throw new DocumentNotFoundException("Document not found or doesn't belong to the user.");
        }
        document.setFirstName(docsDTO.getFirstName());
        document.setLastName(docsDTO.getLastName());
        documentRepository.save(document);
    }

    public Docs createUserDocument(Long userId, DocsDTO docsDTO) {
        Docs newDocument = new Docs();
        newDocument.setFirstName(docsDTO.getFirstName());
        newDocument.setLastName(docsDTO.getLastName());
        return documentRepository.save(newDocument);
    }
    public boolean userHasAdminRole(Long userId) {
        User user = userRepository.findById(Math.toIntExact(userId)).orElse(null);
        if (user != null) {
            Set<Role> roles = user.getRoles();
            for (Role role : roles) {
                if (role.getName() == ERole.ADMIN || role.getName() == ERole.SUPERADMIN) {
                    return true;
                }
            }
        }

        return false;
    }


}



