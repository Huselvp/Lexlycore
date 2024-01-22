package com.iker.Lexly.Controller;
import com.iker.Lexly.DTO.TemplateDTO;
import com.iker.Lexly.Entity.Template;
import com.iker.Lexly.Entity.User;
import com.iker.Lexly.Transformer.TemplateTransformer;
import com.iker.Lexly.config.jwt.JwtService;
import com.iker.Lexly.repository.UserRepository;
import com.iker.Lexly.request.UpdateEmailPassword;
import com.iker.Lexly.service.TemplateService;
import com.iker.Lexly.service.UserService;
import jakarta.security.enterprise.credential.Password;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api/public")
public class TemplateController {
    private  final TemplateService templateService;
    private final TemplateTransformer templateTransformer;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    public TemplateController(PasswordEncoder passwordEncoder,UserService userService,UserRepository userRepository,JwtService jwtService,TemplateService templateService, TemplateTransformer templateTransformer) {
        this.templateService = templateService;
        this.jwtService=jwtService;
        this.passwordEncoder=passwordEncoder;
        this.userService = userService;
        this.templateTransformer = templateTransformer;
        this.userRepository=userRepository;
    }
    @GetMapping("/all_templates")
    public List<TemplateDTO> getAllTemplates() {
        List<Template> templates = templateService.getAllTemplates();
        List<TemplateDTO> templateDTOs = templates.stream()
                .map(templateTransformer::toDTO)
                .collect(Collectors.toList());
        return templateDTOs;
    }
    @GetMapping("/template/{templateId}")
    public ResponseEntity<Template> getTemplateById(@PathVariable Long templateId) {
        Template template = templateService.getTemplateById(templateId);
        return new ResponseEntity<>(template, HttpStatus.OK);
    }
    @GetMapping("/getMe/{token}")
    public ResponseEntity<User> getUserByToken(@PathVariable String token) {
        if (jwtService.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        String username = jwtService.extractUsername(token);
        if (username != null) {
            Optional<User> optionalUser = userRepository.findByUsername(username);
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                return ResponseEntity.ok(user);
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }
    @PutMapping("/update_user/{token}")
    public ResponseEntity<User> updateUser(@PathVariable String token, @RequestBody User updatedUser) throws ChangeSetPersister.NotFoundException {
        User updatedUserResponse = userService.updateUser(token, updatedUser);
        return new ResponseEntity<>(updatedUserResponse, HttpStatus.OK);
    }
    @PatchMapping("updateEMailOrPassword/{token}")
    public ResponseEntity<String> modifyEmailOrPassword(
            @PathVariable String token,
            @RequestBody UpdateEmailPassword updateRequest) {
        if (jwtService.isTokenExpired(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token expired");
        }
        String username = jwtService.extractUsername(token);
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (passwordEncoder.matches(updateRequest.getCurrentPassword(), user.getPassword())) {
                if (updateRequest.getEmail() != null) {
                    if (userRepository.existsUserByEmail(updateRequest.getEmail())) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The updated email is already in use.");
                    }
                    user.setEmail(updateRequest.getEmail());
                }
                if (updateRequest.getNewPassword() != null) {
                    user.setPassword(passwordEncoder.encode(updateRequest.getNewPassword()));
                }
                userRepository.save(user);
                return ResponseEntity.ok("User information updated successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid current password.");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
    }
}