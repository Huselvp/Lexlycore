package com.iker.Lexly.repository;

import com.iker.Lexly.Entity.Case;
import com.iker.Lexly.Entity.Participant;
import com.iker.Lexly.Entity.Role;
import com.iker.Lexly.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User,Integer> {
  Optional<User> findByEmail(String email);
  boolean existsUserByEmail(String email);
 // List<User> findByRole(Role role);
 //Optional<Participant> findByUserAndCase(User user, Case aCase);
}
