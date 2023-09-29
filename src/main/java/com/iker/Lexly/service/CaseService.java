package com.iker.Lexly.service;

import com.iker.Lexly.Entity.Case;
import com.iker.Lexly.Entity.User;
import com.iker.Lexly.Entity.enums.CaseType;
import com.iker.Lexly.Entity.enums.Casestatus;
import com.iker.Lexly.Entity.enums.Subtype;
import com.iker.Lexly.repository.CaseRepository;
import com.iker.Lexly.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CaseService {
    @Autowired
    private final CaseRepository caseRepository;


    @Autowired
    public CaseService(UserRepository userRepository, CaseRepository caseRepository, EmailService emailService) {

        this.caseRepository = caseRepository;
            }
    public Case createCase(Casestatus casestatus, CaseType type, Subtype subtype) {
        Case newCase = new Case();
        newCase.setCasestatus(casestatus);
        newCase.setType(type);
        newCase.setSubtype(subtype);
        newCase.setCreatedDate(LocalDateTime.now());
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        newCase.setUser(loggedInUser);

        return caseRepository.save(newCase);
    }

    public List<Case> getAllCases() {
        return caseRepository.findAll();
    }

    public Optional<Case> getCaseById(Long id) {
        return caseRepository.findById(id);
    }

    public List<Case> getCasesByType(CaseType type) {
        return caseRepository.findByType(type);
    }


        }





