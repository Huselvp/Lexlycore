package com.iker.Lexly.Controller;

import com.iker.Lexly.CaseRequest.CaseRequest;
import com.iker.Lexly.Entity.Case;
import com.iker.Lexly.Entity.User;
import com.iker.Lexly.Entity.enums.CaseType;
import com.iker.Lexly.ResetSecurity.ResetTokenService;
import com.iker.Lexly.config.jwt.JwtService;
import com.iker.Lexly.repository.CaseRepository;
import com.iker.Lexly.service.CaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cases")
@Controller
public class CaseController {
    @Autowired
    private  final ResetTokenService resetTokenService;
    private final CaseService caseService;
    private final CaseRepository caseRepository;
private  final JwtService jwtService;
    @Autowired
    public CaseController(ResetTokenService resetTokenService, CaseService caseService, CaseRepository caseRepository, JwtService jwtService) {
        this.resetTokenService = resetTokenService;
        this.caseRepository=caseRepository;
        this.caseService = caseService;
        this.jwtService=jwtService;
    }
    @PostMapping("/createCase")
    public ResponseEntity<String> createCase(@RequestBody CaseRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            User authenticatedUser = (User) authentication.getPrincipal();
            Case newCase = new Case();
            newCase.setCasestatus(request.getCasestatus());
            newCase.setType(request.getType());
            newCase.setSubtype(request.getSubtype());
            newCase.setCreatedDate(LocalDateTime.now());
            newCase.setUser(authenticatedUser);
            caseRepository.save(newCase);

            return ResponseEntity.ok("Case created successfully");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
        }
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
