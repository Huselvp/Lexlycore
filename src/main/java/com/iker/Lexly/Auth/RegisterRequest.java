package com.iker.Lexly.Auth;

import com.iker.Lexly.Entity.Role;
import com.iker.Lexly.Entity.enums.ERole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String firstname;
    private String lastname;
    private  String email;
    private String password;
    private ERole role;

}
