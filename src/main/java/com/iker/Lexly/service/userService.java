package com.iker.Lexly.service;

import ch.qos.logback.core.boolex.Matcher;
import com.iker.Lexly.DTO.UserDTO;
import com.iker.Lexly.Entity.User;
import com.iker.Lexly.ResetSecurity.ResetTokenService;
import com.iker.Lexly.config.jwt.JwtService;
import com.iker.Lexly.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.repository.CrudRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Configuration
@Service
@RequiredArgsConstructor
public class userService {
    private final ResetTokenService resetTokenService;
    private final EmailService emailService;
    @Autowired
    private final UserRepository userRepository;
    private final JwtService jwtService;
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    public User findByEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            return userOptional.get();
        } else {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
    }
    public String loginUser(String email, String password) throws Exception {
        User user = findByEmail(email);
        if (!userServicepasswordEncoder().matches(password, user.getPassword())) {
            throw new Exception("Invalid credentials");
        }
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getEmail(), user.getPassword(), user.getAuthorities());
        String token = jwtService.generateToken(userDetails);
        return token;
    }
    public User saveUser(User user) {
        return userRepository.save(user);
    }
    @Bean
    public PasswordEncoder userServicepasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
    public void resetPassword(User user, String newPassword) {
        user.setPassword(newPassword);
    }
    public void markEmailAsVerified(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        optionalUser.ifPresent(user -> {
            userRepository.save(user);});
    }
    public boolean emailExists(String email) {
        return userRepository.existsUserByEmail(email);
    }
    public void initiatePasswordReset(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            resetTokenService.deleteTokensByUser(user);
            String resetToken= resetTokenService.generateAndSavePasswordResetToken(user);
            emailService.sendResetPasswordEmail(user, resetToken);
        }
    }
}







