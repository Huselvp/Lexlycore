package com.iker.Lexly.DTO;

import com.iker.Lexly.Entity.enums.Role;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
    @Enumerated(EnumType.STRING)
    private Role role;

    public UserDTO(String country,String description,int zipcode, String town,String adress,String username,Role role,Long userId, String email, String firstName, String lastName, String phonenumber, String picture) {
        this.email = email;
        this.username=username;
        this.country=country;
        this.adress=adress;
        this.description=description;
        this.role=role;
        this.zipcode=zipcode;
        this.town=town;
        this.firstname = firstName;
        this.lastname = lastName;
        this.userId = userId;
        this.phonenumber=phonenumber;
        this.picture = picture;

    }
}