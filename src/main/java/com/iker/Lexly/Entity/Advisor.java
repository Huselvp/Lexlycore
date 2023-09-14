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
    private int NUmberofexperience;
    private String specialite;
    public Advisor(String email, String firstName, String lastName, String password, String phoneNumber, String picture, int numberOfExperience, String specialite) {
        super(email, firstName, lastName, password, phoneNumber, picture);
        this.NUmberofexperience = numberOfExperience;
        this.specialite = specialite;
    }


    public void setNumberOfExperience(int numberOfExperience) {
        this.NUmberofexperience = numberOfExperience;
    }

    public void setSpecialite(String specialite) {
        this.specialite = specialite;
    }

}


