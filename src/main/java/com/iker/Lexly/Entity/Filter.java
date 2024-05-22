package com.iker.Lexly.Entity;
import com.iker.Lexly.Entity.enums.FilterType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Filter {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    @OneToOne
    @JoinColumn(name = "question_id")
    private Question question;

    @Enumerated(EnumType.STRING)
    private FilterType filterType;
    private Integer filterStartInt;
    private Integer filterEndInt;
    private Double filterStartDouble;
    private Double filterEndDouble;



}