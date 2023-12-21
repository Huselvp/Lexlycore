package com.iker.Lexly.Auth;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.iker.Lexly.DTO.UserDTO;
import com.iker.Lexly.Entity.User;
import com.iker.Lexly.Token.Token;
import com.iker.Lexly.Token.TokenRepository;
import com.iker.Lexly.Token.TokenType;
import com.iker.Lexly.Transformer.UserTransformer;
import com.iker.Lexly.config.jwt.JwtService;
import com.iker.Lexly.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final TokenRepository tokenRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private final UserTransformer userTransformer;

    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        String username = request.getFirstname() + " " + request.getLastname();
        try {
//            if (repository.existsByUsername(username)) {
//                return AuthenticationResponse.builder()
//                        .errorMessage("Username already in use")
//                        .build();
//            }
            if (repository.existsUserByEmail(request.getEmail())) {
                return AuthenticationResponse.builder()
                        .errorMessage("Email already in use")
                        .build();
            }
            var userDTO = UserDTO.builder()
                    .firstname(request.getFirstname())
                    .lastname(request.getLastname())
                    .email(request.getEmail())
                    .username(username)
                    .password(passwordEncoder.encode(request.getPassword()))
                    .build();

            User savedUser = repository.save(userTransformer.toEntity(userDTO));
            var jwtToken = jwtService.generateToken((UserDetails) userDTO);
            saveUserToken(savedUser, jwtToken);

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


    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
            var user = repository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            var jwtToken = jwtService.generateToken((UserDetails) user);
           //var refreshToken = jwtService.generateRefreshToken(user);
            revokeAllUserTokens(user);
            saveUserToken(user, jwtToken);
            return AuthenticationResponse.builder()
                    .accessToken(jwtToken)
                    // .refreshToken(refreshToken)
                    .build();
        } catch (AuthenticationException e) {
            throw e;

        }
    }


    private void saveUserToken(User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
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
            if (jwtService.isTokenValid(refreshToken, (UserDetails) user)) {
                var accessToken = jwtService.generateToken((UserDetails) user);
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