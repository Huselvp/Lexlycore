package com.iker.Lexly.ResetSecurity;

import com.iker.Lexly.Entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class ResetTokenService {

    @Autowired
    private ResettokenRepository resetTokenRepository;
    private Map<String, User> resetTokens = new HashMap<>();


    public String generateToken(User user) {
        // Generate a unique token
        String resetToken = UUID.randomUUID().toString();

        // Store the token in the database
        Resettoken tokenEntity = new Resettoken();
        tokenEntity.setToken(resetToken);
        tokenEntity.setUser(user);
        // Set an expiration time for the token, e.g., 1 hour from now
        tokenEntity.setExpirationTime(LocalDateTime.now().plusHours(1));

        resetTokenRepository.save(tokenEntity);

        return resetToken;
    }

    public boolean validateToken(String token) {
        Optional<Resettoken> optionalToken = resetTokenRepository.findByToken(token);
        if (optionalToken.isPresent()) {
            Resettoken resetToken = optionalToken.get();

            LocalDateTime expirationTime = resetToken.getExpirationTime();
            LocalDateTime currentTime = LocalDateTime.now();
            return !currentTime.isAfter(expirationTime);
        }
        return false;
    }
    public void deleteToken(String token) {
        resetTokenRepository.deleteByToken(token);
    }

    public User getUserFromToken(String token) {
        // Retrieve the associated user from the token
        return resetTokens.get(token);
    }

    public void invalidateToken(String token) {
        // Remove the token from storage after it's used
        resetTokens.remove(token);
    }

}