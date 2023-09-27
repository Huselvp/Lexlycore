package com.iker.Lexly.service;

import com.iker.Lexly.Entity.Case;
import com.iker.Lexly.Entity.enums.CaseType;
import com.iker.Lexly.repository.CaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CaseService {
    private final CaseRepository caseRepository;

    @Autowired
    public CaseService(CaseRepository caseRepository) {
        this.caseRepository = caseRepository;
    }

    public Case createCase(Case aCase) {
        return caseRepository.save(aCase);
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
