package com.iker.Lexly.Auth;
import com.iker.Lexly.Entity.User;
import com.iker.Lexly.ResetSecurity.ResetTokenService;
import com.iker.Lexly.Token.TokenRepository;
import com.iker.Lexly.repository.UserRepository;
import com.iker.Lexly.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    @Autowired
    private final UserService userService;
    @Autowired
    private  final  ResetTokenService resetTokenService;
    @Autowired
    private final PasswordEncoder passwordEncoder;
    @Autowired
    private  final AuthenticationService service;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final TokenRepository tokenRepository;
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request,
            HttpServletResponse response
    ) {
        AuthenticationResponse authenticationResponse = service.register(request, response);
        return ResponseEntity.ok(authenticationResponse);
    }
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request,
            HttpServletResponse response
    ) {
        AuthenticationResponse authenticationResponse = service.authenticate(request, response);
        return ResponseEntity.ok(authenticationResponse);
    }
    @PostMapping("/refresh-token")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        service.refreshToken(request, response);
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<String> requestPasswordReset(@RequestBody Map<String, String> request) {
            String email = request.get("email");
            boolean emailExists = userService.emailExists(email);
            if (emailExists) {
                userService.initiatePasswordReset(email);
                return ResponseEntity.ok("Password reset instructions sent to your email.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email not found");
            }
        }
    @PostMapping("/reset")
    public ResponseEntity<String> handlePasswordReset(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");
        if (resetTokenService.validateToken(token)) {
            Optional<User> optionalUser = resetTokenService.findUserByPasswordToken(token);
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                passwordEncoder.encode(newPassword);
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepository.save(user);
                resetTokenService.deleteToken(token);
                resetTokenService.invalidateToken(token);
                return ResponseEntity.ok("Password reset successful");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token");
        }
    }
    @PostMapping("/logout")
    @Transactional
    public void logout(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return;
        }
        jwt = authHeader.substring(7);
        var storedToken = tokenRepository.findByToken(jwt).orElse(null);
        if (storedToken != null) {
            storedToken.setExpired(true);
            storedToken.setRevoked(true);
            tokenRepository.save(storedToken);
            tokenRepository.deleteByToken(jwt);
            SecurityContextHolder.clearContext();
        }
    }



}
