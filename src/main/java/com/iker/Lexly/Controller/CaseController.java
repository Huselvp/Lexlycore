package com.iker.Lexly.Controller;

import com.iker.Lexly.Entity.Case;
import com.iker.Lexly.Entity.User;
import com.iker.Lexly.Entity.enums.CaseType;
import com.iker.Lexly.service.CaseService;
import com.iker.Lexly.service.ParticipantService;
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
    public CaseController(CaseService caseService, ParticipantService participantService, CaseService caseService1) {

        this.caseService = caseService1;
    }
    @PostMapping("/create")
    public Case createCase(@RequestBody Case aCase, User user) {
        return caseService.createCase(aCase,user);
    }
    @GetMapping("/All")
    public List<Case> getAllCases() {
        return caseService.getAllCases();
    }

    @GetMapping("/{id}")
    public Optional<Case> getCaseById(@PathVariable Long id) {
        return caseService.getCaseById(id);
    }

    @GetMapping("/type/{type}")
    public List<Case> getCasesByType(@PathVariable CaseType type) {
        return caseService.getCasesByType(type);
    }
}
