package com.iker.Lexly.Entity.Form;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.iker.Lexly.Entity.Question;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Form {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;

    @OneToOne
    @JoinColumn(name = "question_id")
    @JsonIgnore
    private Question question;


//    @OneToMany(mappedBy = "form", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<Block> blocks = new ArrayList<>();


}

