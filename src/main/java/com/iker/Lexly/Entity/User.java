package com.iker.Lexly.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.iker.Lexly.Entity.enums.Role;
import com.iker.Lexly.Paiement.Order;
import com.iker.Lexly.Token.Token;
import lombok.*;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
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
    @Column(length = 100,name = "username", unique = true)
    private String username;
    @Column(length = 50)
    private String lastname;
    @Column(length = 50)
    private String phonenumber;
    @Column(length = 50)
    private String description;
    @Column(length = 50)
    private String adress;
    @Column(name = "email", unique = true)
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
    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "user")
    @ToString.Exclude
    @JsonIgnore
    @JsonManagedReference
    private List<Token> tokens;
    @OneToMany(mappedBy = "user")
    private List<Template> templates;
   @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orders;



    public User(String username,String email, String firstName, String lastName, String password, String phonenumber, String picture, Role role) {
        this.email = email;
        this.username=username;
        this.firstname = firstName;
        this.lastname = lastName;
        this.password = password;
        this.phonenumber=phonenumber;
        this.picture = picture;

        this.role = role;
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return role.getAuthorities();
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
    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }
}

