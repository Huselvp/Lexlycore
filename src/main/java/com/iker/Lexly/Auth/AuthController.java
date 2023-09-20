package com.iker.Lexly.Auth;
import com.iker.Lexly.Entity.User;
import com.iker.Lexly.ResetSecurity.ResetTokenService;
import com.iker.Lexly.service.EmailService;
import com.iker.Lexly.service.userService;
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
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private final  EmailService emailService;
     @Autowired
    private final userService userService;
    @Autowired
    private  final  ResetTokenService resetTokenService;
    @Autowired
    private  final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register (
      @RequestBody RegisterRequest request
    ){
       return ResponseEntity.ok(service.register(request));
    }
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate (
            @RequestBody AuthenticationRequest request
    ) {
        return  ResponseEntity.ok(service.authenticate(request));

    }
    @PostMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestBody String email) {
        boolean emailExists = userService.emailExists(email);

        if (emailExists) {
            userService.markEmailAsVerified(email);
            return ResponseEntity.ok("Email verified successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email not found");
        }
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<String> requestPasswordReset(@RequestBody Map<String, String> request) {
            String email = request.get("email");
            logger.info("Received email: " + email);
            boolean emailExists = userService.emailExists(email);
            logger.info("Email exists in the database: " + emailExists);

            if (emailExists) {
                userService.initiatePasswordReset(email);
                return ResponseEntity.ok("Password reset instructions sent to your email.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email not found");
            }
        }
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPasswordRequest(@RequestBody String email) {
        User user = userService.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        String resetToken = resetTokenService.generateToken(user);
       emailService.sendResetPasswordEmail(user, resetToken);
        return ResponseEntity.ok("Reset link sent successfully");
    }
    @PostMapping("/reset-password/{token}")
    public ResponseEntity<String> handlePasswordReset(@PathVariable String token,
            @RequestBody String newPassword) {
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
    @PostMapping("/set-new-password")
    public ResponseEntity<String> setNewPassword(@RequestParam("token") String token, @RequestBody String newPassword) {
        boolean isTokenValid = resetTokenService.validateToken(token);
        if (!isTokenValid) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token");
        }
        User user = resetTokenService.getUserFromToken(token);
        userService.resetPassword(user, newPassword);
        resetTokenService.invalidateToken(token);
        return ResponseEntity.ok("Password reset successful");
    }
}


