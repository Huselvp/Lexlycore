package com.iker.Lexly.repository;

import com.iker.Lexly.Entity.Role;
import com.iker.Lexly.Entity.enums.ERole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface RoleRepository extends JpaRepository<Role,Integer> {
    @Override
    Optional<Role> findById(Integer integer);
    Optional<Role> findByName(ERole name);
}
