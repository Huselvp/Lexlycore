package com.iker.Lexly.service;

import com.iker.Lexly.Entity.Category;
import com.iker.Lexly.Entity.User;
import com.iker.Lexly.Exceptions.UserNotFoundException;
import com.iker.Lexly.ResetSecurity.ResetTokenService;
import com.iker.Lexly.config.jwt.JwtService;
import com.iker.Lexly.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Configuration
@Service
@RequiredArgsConstructor
public class UserService {
    private final ResetTokenService resetTokenService;
    private final EmailService emailService;
    @Autowired
    private final UserRepository userRepository;
    private final JwtService jwtService;

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
            user.setEmailVerified(true);
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
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    public void deleteUser(Long id) {
        User user = userRepository.findById(Math.toIntExact(id))
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " +id));
           userRepository.delete(user);

    }
    public User updateUser(Long userId, User updatedUser) throws ChangeSetPersister.NotFoundException {

        User existingUser = userRepository.findById(Math.toIntExact(userId))
                .orElseThrow(() -> new ChangeSetPersister.NotFoundException());

        existingUser.setFirstname(updatedUser.getFirstname());
        existingUser.setLastname(updatedUser.getLastname());
        existingUser.setPhonenumber(updatedUser.getPhonenumber());
        existingUser.setDescription(updatedUser.getDescription());
        existingUser.setAdress(updatedUser.getAdress());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setCountry(updatedUser.getCountry());
        existingUser.setZipcode(updatedUser.getZipcode());
        existingUser.setTown(updatedUser.getTown());
        return userRepository.save(existingUser);
    }
}








