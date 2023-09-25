package com.iker.Lexly.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.iker.Lexly.Entity.enums.Casestatus;
import com.iker.Lexly.Entity.enums.ERole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "_case" )
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Case {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "case_id")
    private long case_id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Casestatus casestatus;

    @Column(length =20)
    private float cost;

    @Column(length=20)
    private Date CreatedDate;

    @Column(length=20)
    private Date DeletedDate;

    @Column(length=20)
    private Date ModifiedDate;





}
