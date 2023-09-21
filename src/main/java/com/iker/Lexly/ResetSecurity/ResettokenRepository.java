package com.iker.Lexly.ResetSecurity;

import com.iker.Lexly.Entity.User;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;
import com.iker.Lexly.ResetSecurity.Resettoken;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
@Repository

public interface ResettokenRepository extends JpaRepository<Resettoken, Long> {
    Optional<Resettoken> findByToken(String token);
    void deleteByToken(String token);
    void deleteByUser(User user);
}

