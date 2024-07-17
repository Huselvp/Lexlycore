package com.iker.Lexly.Entity.Form;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
;
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Block {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int numberOfBloc;

    @Enumerated(EnumType.STRING)
    private BlockType type;

    @ManyToOne
    @JsonBackReference
    private Form form;


}