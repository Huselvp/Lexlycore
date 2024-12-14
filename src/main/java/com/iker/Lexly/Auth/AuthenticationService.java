package com.iker.Lexly.Auth;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.iker.Lexly.Entity.User;

import com.iker.Lexly.Entity.enums.Role;
import com.iker.Lexly.config.jwt.JwtService;
import com.iker.Lexly.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Base64;


@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private  final  UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    @Value("${app.secret-key}")
    private String secretKey;
    @Value("${my-custom-cookie-name}")
    private String cookieName;
    @Value("${admin.email}")
    private String adminEmail;
    @Value("${admin.password}")
    private String adminPassword;


    public AuthenticationResponse register(RegisterRequest request, HttpServletResponse response) {
        String username = request.getFirstname() + " " + request.getLastname();
        try {
            if (userRepository.existsByUsername(username)) {
                return AuthenticationResponse.builder()
                        .errorMessage("Username already in use")
                        .build();
            }
            if (userRepository.existsUserByEmail(request.getEmail())) {
                return AuthenticationResponse.builder()
                        .errorMessage("Email already in use")
                        .build();
            }

            // Determine role
            Role role = Role.SUSER; // Default role
            if (request.getEmail().equals(adminEmail) && request.getPassword().equals(adminPassword)) {
                role = Role.ADMIN;
            }

            // Build and save user
            var user = User.builder()
                    .firstname(request.getFirstname())
                    .lastname(request.getLastname())
                    .email(request.getEmail())
                    .username(username)
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(role)
                    .build();
            var savedUser = userRepository.save(user);

            // Generate token and set cookie
            var jwtToken = jwtService.generateToken(savedUser);
            Cookie cookie = new Cookie(cookieName, jwtToken);
            cookie.setMaxAge(1800);
            cookie.setPath("/");
            response.addCookie(cookie);

            return AuthenticationResponse.builder()
                    .accessToken(jwtToken)
                    .build();
        } catch (DataIntegrityViolationException ex) {
            if (ex.getMessage().contains("duplicate key value violates unique constraint \"uknlcolwbx8ujaen5h0u2kr2bn2\"")) {
                return AuthenticationResponse.builder()
                        .errorMessage("The username already exists")
                        .build();
            } else {
                return AuthenticationResponse.builder()
                        .errorMessage("An error occurred during registration")
                        .build();
            }
        }
    }
    public AuthenticationResponse authenticate(AuthenticationRequest request, HttpServletResponse response) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
            var user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            var jwtToken = jwtService.generateToken(user);

            Cookie cookie = new Cookie(cookieName, jwtToken);
            cookie.setMaxAge(1800);
            cookie.setPath("/");
            cookie.setHttpOnly(true);
            response.addCookie(cookie);
            return AuthenticationResponse.builder()
                    .accessToken(jwtToken)
                    .build();
        } catch (AuthenticationException e) {
            e.printStackTrace();
            throw e;
        }
    }
}