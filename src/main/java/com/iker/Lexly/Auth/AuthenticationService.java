package com.iker.Lexly.Auth;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.iker.Lexly.Entity.User;

import com.iker.Lexly.config.jwt.JwtService;
import com.iker.Lexly.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;



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
            var user = User.builder()
                    .firstname(request.getFirstname())
                    .lastname(request.getLastname())
                    .email(request.getEmail())
                    .username(username)
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(request.getRole())
                    .build();
            var savedUser = userRepository.save(user);
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