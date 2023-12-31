package com.iker.Lexly.Auth;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.iker.Lexly.Entity.User;
import com.iker.Lexly.Token.Token;
import com.iker.Lexly.Token.TokenRepository;
import com.iker.Lexly.Token.TokenType;
import com.iker.Lexly.config.jwt.JwtService;
import org.springframework.session.FindByIndexNameSessionRepository;
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
import org.springframework.session.Session;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final TokenRepository tokenRepository;
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

    private void saveUserToken(User user, String sessionId) {

        Session session = springSessionRepository.findById(sessionId);
        if (session != null) {
            session.setAttribute("email", user.getEmail());
            springSessionRepository.save(session);
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
          //  cookie.setSecure(true);
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
    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(Math.toIntExact(user.getUserId()));
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;
        if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
            return;
        }
        refreshToken = authHeader.substring(7);
        userEmail = jwtService.extractUsername(refreshToken);
        if (userEmail != null) {
            var user = this.repository.findByEmail(userEmail)
                    .orElseThrow();
            if (jwtService.isTokenValid(refreshToken, user)) {
                var accessToken = jwtService.generateToken(user);
                revokeAllUserTokens(user);
                saveUserToken(user, accessToken);
                var authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .build();
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
        }
    }
}