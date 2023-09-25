package com.iker.Lexly.Entity;

import jakarta.persistence.Table;
import lombok.*;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Getter
@Entity
@Table(name = "advisor")
@DiscriminatorValue("advisor")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Advisor extends User{
    private int Numberofexperience;
    private String specialite;

    public void setNumberOfExperience(int numberOfExperience) {
        this.Numberofexperience = numberOfExperience;
    }

    public void setSpecialite(String specialite) {
        this.specialite = specialite;
    }

}


