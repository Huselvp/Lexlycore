package com.iker.Lexly.service;

import com.iker.Lexly.Entity.Participant;
import com.iker.Lexly.Entity.enums.Casestatus;
import com.iker.Lexly.repository.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParticipantService {
    private final ParticipantRepository participantRepository;

    @Autowired
    public ParticipantService(ParticipantRepository participantRepository) {
        this.participantRepository = participantRepository;
    }

    public Participant createParticipant(Participant participant) {
        return participantRepository.save(participant);
    }

    public List<Participant> getParticipantsByStatus(Casestatus status) {
        return participantRepository.findByStatus(status);
    }
}
