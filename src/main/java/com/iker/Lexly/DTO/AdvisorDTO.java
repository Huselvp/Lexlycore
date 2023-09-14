package com.iker.Lexly.DTO;

import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Builder
public class AdvisorDTO {
    private String email;
    private String firstname;
    private String lastname;
    private String password;
    private String phonenumber;
    private String picture;
    private int numberOfExperience;
    private String specialite;

    public AdvisorDTO(Long userId, String email, String firstName, String lastName, String password, String phoneNumber, String picture,int numberOfExperience,String specialite ) {
        this.email = email;
        this.firstname = firstName;
        this.lastname = lastName;
        this.password = password;
        this.phonenumber=phoneNumber;
        this.picture = picture;
        this.numberOfExperience=numberOfExperience;
        this.specialite=specialite;

    }
}

