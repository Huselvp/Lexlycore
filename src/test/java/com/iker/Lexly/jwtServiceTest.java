package com.iker.Lexly;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.iker.Lexly.config.jwt.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class jwtServiceTest {

    private JwtService jwtservice = new JwtService();
    @BeforeEach
    void setUp() {
        jwtservice = new JwtService();
       // jwtservice.init();
    }


    @Test
    public void testExtractUsername() {
        // Replace "YOUR_TOKEN_HERE" with an actual valid JWT token
        String token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBZG1pbiIsImlhdCI6MTcwMjQ1NDEyNCwiZXhwIjoxNzAyNTQwNTI0fQ.c5NhuVdQjFbWW3cW7coZLRWl1C9BLQJRqELBjxGNMzs";

        String username = jwtservice.extractUsername(token);

        // Replace "EXPECTED_USERNAME" with the expected username in your token
        assertEquals("Admin", username);
    }


}

