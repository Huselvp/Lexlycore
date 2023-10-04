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
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
@Service
public class DocsService {
    @Autowired
    private DocsRepository docsRepository;
    public Docs addAttributesToDocs(Long docsId, Map<String, Object> attributes) {
        Optional<Docs> optionalDocs = docsRepository.findById(docsId);
        if (optionalDocs.isPresent()) {
            Docs docs = optionalDocs.get();

            // Modify the Docs entity based on the attributes
            if (attributes.containsKey("firstName")) {
                docs.setFirstName((String) attributes.get("firstName"));
            }
            if (attributes.containsKey("lastName")) {
                docs.setLastName((String) attributes.get("lastName"));
            }
            // Repeat this pattern for other attributes you want to set

            docsRepository.save(docs); // Save the updated Docs object

            return docs;
        } else {
            throw new EntityNotFoundException("Docs with ID " + docsId + " not found");
        }
    }

    }
