package com.iker.Lexly.Controller;

import com.iker.Lexly.Entity.Case;
import com.iker.Lexly.Entity.enums.CaseType;
import com.iker.Lexly.service.CaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cases")
@Controller
public class CaseController {
    private final CaseService caseService;

    @Autowired
    public CaseController(CaseService caseService) {
        this.caseService = caseService;
    }

    @PostMapping("/api/cases/create-case")
    public Case createCase(@RequestBody Case aCase) {
        return caseService.createCase(aCase);
    }

    @GetMapping("/api/cases/getAllCases")
    public List<Case> getAllCases() {
        return caseService.getAllCases();
    }

    @GetMapping("api/cases/{id}")
    public Optional<Case> getCaseById(@PathVariable Long id) {
        return caseService.getCaseById(id);
    }

    @GetMapping("api/cases/type/{type}")
    public List<Case> getCasesByType(@PathVariable CaseType type) {
        return caseService.getCasesByType(type);
    }
}
