package com.iker.Lexly.repository;

import com.iker.Lexly.Entity.Case;
import com.iker.Lexly.Entity.Participant;
import com.iker.Lexly.Entity.User;
import com.iker.Lexly.Entity.enums.Casestatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant,Long> {
    List<Participant> findByStatus(Casestatus status);

}
