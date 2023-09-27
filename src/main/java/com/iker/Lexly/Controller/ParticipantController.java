package com.iker.Lexly.Controller;

import com.iker.Lexly.Entity.Participant;
import com.iker.Lexly.Entity.enums.Casestatus;
import com.iker.Lexly.service.ParticipantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/participants")
public class ParticipantController {
    private final ParticipantService participantService;

    @Autowired
    public ParticipantController(ParticipantService participantService) {
        this.participantService = participantService;
    }

    @PostMapping("/create")
    public Participant createParticipant(@RequestBody Participant participant) {
        return participantService.createParticipant(participant);
    }

    @GetMapping("/status/{status}")
    public List<Participant> getParticipantsByStatus(@PathVariable Casestatus status) {
        return participantService.getParticipantsByStatus(status);
    }
}
