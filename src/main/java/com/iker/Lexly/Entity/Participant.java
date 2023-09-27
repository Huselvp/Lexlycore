package com.iker.Lexly.Entity;

import com.iker.Lexly.Entity.enums.Casestatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "participant")
public class Participant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "participant_id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Casestatus status;

    @Column(name = "joined_at")
    private LocalDateTime joinedAt;

    @ManyToMany
    @JoinTable(
            name = "user_participant",
            joinColumns = @JoinColumn(name = "participant_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> users = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "case_participant",
            joinColumns = @JoinColumn(name = "participant_id"),
            inverseJoinColumns = @JoinColumn(name = "case_id")
    )
    private Set<Case> cases = new HashSet<>();


}


