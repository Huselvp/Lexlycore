package com.iker.Lexly.ResetSecurity;

import com.iker.Lexly.Entity.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity

public class Resettoken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;

    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    private LocalDateTime expirationTime;
    public void setToken(String token) {
        this.token = token;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setExpirationTime(LocalDateTime expirationTime) {
        this.expirationTime = expirationTime;
    }

    public LocalDateTime getExpirationTime() {
        return expirationTime;
    }


    // Constructors, getters, and setters...
}
