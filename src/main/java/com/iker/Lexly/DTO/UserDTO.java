package com.iker.Lexly.DTO;

import com.iker.Lexly.Entity.enums.Role;
import lombok.*;
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Builder
public class UserDTO {
    private Long userId;
    private String firstname;
    private String username;
    private String lastname;
    private String phonenumber;
    private String description;
    private String adress;
    private String email;
    private String password;
    private String country;
    private int zipcode;
    private String town;
    private boolean verificationemail;
    private String picture;


    public UserDTO(Long userId, String email, String firstName, String lastName, String password, String phoneNumber, String picture) {
        this.email = email;
        this.firstname = firstName;
        this.lastname = lastName;
         this.userId = userId;
        this.phonenumber=phoneNumber;
        this.picture = picture;

    }
}
