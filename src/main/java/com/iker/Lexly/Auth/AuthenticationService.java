package com.iker.Lexly.Auth;
import ch.qos.logback.core.boolex.Matcher;
import com.iker.Lexly.Auth.*;
import com.iker.Lexly.Entity.Role;
import com.iker.Lexly.Entity.User;
import com.iker.Lexly.Entity.enums.ERole;
import com.iker.Lexly.config.jwt.JwtService;
import com.iker.Lexly.repository.RoleRepository;
import com.iker.Lexly.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class  AuthenticationService {
    
    private  final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private  final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;


    public AuthenticationResponse register(RegisterRequest request) {
        ERole roleName = ERole.valueOf(String.valueOf(request.getRole()));
        var role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new IllegalArgumentException("Role not found: " + roleName));
        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();
        userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        var response = AuthenticationResponse.builder()
                .token(jwtToken)
                .user(user)
                .build();
        return response;
    }
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        var jwtToken = jwtService.generateToken(user);
        var response = AuthenticationResponse.builder()
                .token(jwtToken)
                .user(user)
                .build();
        return response;
    }

}
