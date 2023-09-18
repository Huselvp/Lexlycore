package com.iker.Lexly.service;

import ch.qos.logback.core.boolex.Matcher;
import com.iker.Lexly.DTO.UserDTO;
import com.iker.Lexly.Entity.User;
import com.iker.Lexly.config.jwt.JwtService;
import com.iker.Lexly.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Configuration
@Service
@RequiredArgsConstructor
public class userService {

    private final UserRepository userRepository;
    private final JwtService jwtService;



    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
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
}

