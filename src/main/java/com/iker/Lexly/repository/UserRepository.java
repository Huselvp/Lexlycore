package com.iker.Lexly.repository;
import com.iker.Lexly.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Integer> {
  Optional<User> findByEmail(String email);

  boolean existsUserByEmail(String email);
  Optional<User> findByUsername(String username);

}
