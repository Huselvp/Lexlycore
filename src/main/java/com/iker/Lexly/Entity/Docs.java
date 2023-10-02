package com.iker.Lexly.Entity;

import com.iker.Lexly.Entity.enums.DocsStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "docs")
public class Docs {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "docs_id")
    private Long id;

    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
    private String zipCode;
    private String country;
    private Long templateId;


    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @Enumerated(EnumType.STRING)
    private DocsStatus status;


}

