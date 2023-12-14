package com.iker.Lexly.Token;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Integer> {

    @Query(value = """
    select t from Token t inner join t.user u
    where u.userId = :userId and (t.expired = false or t.revoked = false)
""")
    List<Token> findAllValidTokenByUser(@Param("userId") Integer userId);


    Optional<Token> findByToken(String token);
}
