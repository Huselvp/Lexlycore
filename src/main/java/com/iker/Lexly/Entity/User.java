package com.iker.Lexly.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.iker.Lexly.Entity.enums.ERole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@Entity
@Table(name = "_user" , uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
})
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;
    @Column(length = 50)
    private String firstname;
    @Column(length = 50)
    private String username;
    @Column(length = 50)
    private String lastname;
    @Column(length = 50)
    private String phonenumber;
    @Column(length = 50)
    private String description;
    @Column(length = 50)
    private String adress;
    @Column(length = 50)
    private String email;
    @Column(length = 250)
    @JsonIgnore
    private String password;
    @Column(length = 50)
    private String country;
    @Column(length = 50)
    private int zipcode;
    @Column(length = 50)
    private String town;
    @Column(length = 50)
    private boolean verificationemail;
    private String picture;
    @ManyToOne
    @JsonIgnore
    @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Role role = new Role();
    @ManyToMany
    @JoinTable(name = "user_template",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "template_id"))
    private Set<Template> templates = new HashSet<>();

    public User(String email, String firstName, String lastName, String password, String phoneNumber, String picture) {
        this.email = email;
        this.firstname = firstName;
        this.lastname = lastName;
        this.password = password;
        this.phonenumber=phoneNumber;
        this.picture = picture;
    }

    public User(String email, String firstName, String lastName, String password, String phoneNumber, String picture, Role role) {
        this.email = email;
        this.firstname = firstName;
        this.lastname = lastName;
        this.password = password;
        this.phonenumber=phoneNumber;
        this.picture = picture;
        this.role = role;
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
     return List.of(new SimpleGrantedAuthority(role.getName().name()));
    }
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true ;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public void setEmailVerified(boolean verificationemail){
        this .verificationemail=verificationemail;
    }


    public Long getId() {
        return userId;
    }

    public void setId(Long id) {
        this.userId = id;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}

