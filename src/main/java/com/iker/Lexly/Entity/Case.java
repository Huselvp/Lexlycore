package com.iker.Lexly.Entity;

import com.iker.Lexly.Entity.enums.CaseType;
import com.iker.Lexly.Entity.enums.Casestatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

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
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private CaseType type;
    @Column(length =20)
    private float cost;

    @Column(length=20)
    private Date CreatedDate;

    @Column(length=20)
    private Date DeletedDate;

    @Column(length=20)
    private Date ModifiedDate;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @ManyToMany(mappedBy = "cases")
    private Set<Participant> participants = new HashSet<>();
    public Case(Casestatus casestatus,CaseType type, float cost, Date createdDate, Date deletedDate, Date modifiedDate) {
        this.casestatus = casestatus;
        this.type= type;
        this.cost = cost;
        this.CreatedDate = createdDate;
        this.DeletedDate = deletedDate;
        this.ModifiedDate = modifiedDate;
    }
}

