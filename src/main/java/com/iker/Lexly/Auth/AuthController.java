package com.iker.Lexly.Auth;
import com.iker.Lexly.Entity.User;
import com.iker.Lexly.Entity.enums.ERole;
import com.iker.Lexly.ResetSecurity.ResetTokenService;
import com.iker.Lexly.service.EmailService;
import com.iker.Lexly.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    @Autowired
    private final UserService userService;
    @Autowired
    private  final  ResetTokenService resetTokenService;
    @Autowired
    private  final AuthenticationService service;

     @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(service.register(request));
    }
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate (
            @RequestBody AuthenticationRequest request
    ) throws Exception {
        return  ResponseEntity.ok(service.authenticate(request));
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
    @PostMapping("/reset-password")
    public ResponseEntity<String> handlePasswordReset(Map<String,String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");
        boolean isTokenValid = resetTokenService.validateToken(token);
        if (!isTokenValid) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token");
        }
        User user = resetTokenService.getUserFromToken(token);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        userService.resetPassword(user, newPassword);
        resetTokenService.deleteToken(token);
        resetTokenService.invalidateToken(token);
        return ResponseEntity.ok("Password reset successful");
    }
}


