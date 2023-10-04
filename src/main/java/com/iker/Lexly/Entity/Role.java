package com.iker.Lexly.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.iker.Lexly.Entity.enums.ERole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.List;

    @Entity
    @Table(name = "roles")
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public class Role  {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Integer id;
        @Enumerated(EnumType.STRING)
        @Column(length = 20)
        private ERole name;
        @JsonIgnore
        @OneToMany(mappedBy = "role", fetch = FetchType.LAZY)
        private List<User> users = new ArrayList<>();
        public Role(ERole name) {
            this.name = name;
        }
    }


