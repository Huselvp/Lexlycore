package com.iker.Lexly.service;

import com.iker.Lexly.DTO.UserDTO;
import com.iker.Lexly.Entity.User;
import com.iker.Lexly.Exceptions.TokenExpiredException;
import com.iker.Lexly.Exceptions.UnauthorizedException;
import com.iker.Lexly.Exceptions.UsernameAlreadyExistsException;
import com.iker.Lexly.ResetSecurity.ResetTokenService;
import com.iker.Lexly.Transformer.UserTransformer;
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
    @Autowired
    private final JwtService jwtService;

    public User findByEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            return userOptional.get();
        } else {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
    }

    @Bean
    public PasswordEncoder userServicepasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    public boolean emailExists(String email) {
        return userRepository.existsUserByEmail(email);
    }

    public void initiatePasswordReset(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            resetTokenService.deleteTokensByUser(user);
            String resetToken = resetTokenService.generateAndSavePasswordResetToken(user);
            emailService.sendResetPasswordEmail(user, resetToken);
        }
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    public void deleteUser(Long id) {
        User user = userRepository.findById(Math.toIntExact(id))
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + id));
        userRepository.delete(user);

    }
    public User updateUser(String token, User updatedUser) throws ChangeSetPersister.NotFoundException {
        String username = jwtService.extractUsername(token);
        if (jwtService.isTokenExpired(token)) {
            throw new UnauthorizedException("Token expired");
        }
        if (!username.equals(updatedUser.getUsername()) && userRepository.existsByUsername(updatedUser.getUsername())) {
            throw new UsernameAlreadyExistsException("Username already exists");
        }
        User existingUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ChangeSetPersister.NotFoundException());
        existingUser.setFirstname(updatedUser.getFirstname());
        existingUser.setLastname(updatedUser.getLastname());
        existingUser.setPhonenumber(updatedUser.getPhonenumber());
        existingUser.setDescription(updatedUser.getDescription());
        existingUser.setAdress(updatedUser.getAdress());
        existingUser.setCountry(updatedUser.getCountry());
        existingUser.setZipcode(updatedUser.getZipcode());
        existingUser.setTown(updatedUser.getTown());
        if (!existingUser.getUsername().equals(updatedUser.getUsername())) {
            existingUser.setUsername(updatedUser.getUsername());
        }

        return userRepository.save(existingUser);
    }
//    public User updateUser(String token, User updatedUser) throws ChangeSetPersister.NotFoundException {
//        String username = jwtService.extractUsername(token);
//        if (jwtService.isTokenExpired(token)) {
//            throw new UnauthorizedException("Token expired");
//        }
//
//        User existingUser = userRepository.findByUsername(username)
//                .orElseThrow(() -> new ChangeSetPersister.NotFoundException());
//        existingUser.setFirstname(updatedUser.getFirstname());
//        existingUser.setLastname(updatedUser.getLastname());
//        existingUser.setPhonenumber(updatedUser.getPhonenumber());
//        existingUser.setDescription(updatedUser.getDescription());
//        existingUser.setAdress(updatedUser.getAdress());
//        existingUser.setCountry(updatedUser.getCountry());
//        existingUser.setZipcode(updatedUser.getZipcode());
//        existingUser.setTown(updatedUser.getTown());
//
//        return userRepository.save(existingUser);
//    }
}








