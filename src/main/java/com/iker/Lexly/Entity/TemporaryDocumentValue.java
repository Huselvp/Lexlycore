package com.iker.Lexly.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
    @Entity
    @Table(name = "temporary_document_values")
    public class TemporaryDocumentValue {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne
        @JoinColumn(name = "document_id", nullable = false)
        private Documents document;

        @Column(nullable = false)
        private Long questionId;

        @Column(columnDefinition = "TEXT")
        private String userInputJson;

        @Column(name = "last_updated", nullable = false)
        private LocalDateTime lastUpdated;


    }

