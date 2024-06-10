package com.iker.Lexly.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DocumentSubQuestionValue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long documentSubQuestionValueId;

    @Column(length = 100000)
    private String value;

    @ManyToOne
    @JoinColumn(name = "SubQuestion_id")
    private SubQuestion subQuestion;

    @ManyToOne
    @JoinColumn(name = "document_id")
    private Documents document;

    public DocumentSubQuestionValue(SubQuestion subQuestion, Documents document, String value) {
        this.document=document;
        this.value=value;
        this.subQuestion=subQuestion;
    }
}
