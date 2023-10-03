package com.iker.Lexly.repository;

import com.iker.Lexly.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User,Integer> {
  Optional<User> findByEmail(String email);
  boolean existsUserByEmail(String email);
   User findByUsername(String username);

}
