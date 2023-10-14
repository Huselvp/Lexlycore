package com.iker.Lexly.Entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "advisor")
@DiscriminatorValue("advisor")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Advisor extends User{
    private int NUmberofexperience;
    private String specialite;

    public void setNumberOfExperience(int numberOfExperience) {
        this.NUmberofexperience = numberOfExperience;
    }

    public void setSpecialite(String specialite) {
        this.specialite = specialite;
    }

}


