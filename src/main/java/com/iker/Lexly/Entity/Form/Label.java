package com.iker.Lexly.Entity.Form;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.HashMap;
import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Label {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 20)
    private String name;
    private int position;
    @Enumerated(EnumType.STRING)
    private LabelType type;


    @ElementCollection
    @CollectionTable(name = "label_options", joinColumns = @JoinColumn(name = "label_id"))
    @MapKeyColumn(name = "option_key")
    @Column(name = "option_value")
    private Map<Long, String> options = new HashMap<>();

    @ManyToOne
    @JsonBackReference
    private Block block;

}
