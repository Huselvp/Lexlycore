package com.iker.Lexly.repository;

import com.iker.Lexly.Entity.Documents;
import com.iker.Lexly.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentsRepository extends JpaRepository<Documents,Long> {
    List<Documents> findByUser(User user);
    List<Documents> findByUserId(Long userId);

}
