package com.iker.Lexly.Entity.enums;

import com.iker.Lexly.Entity.Permission;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.iker.Lexly.Entity.Permission.*;
@RequiredArgsConstructor
public enum Role {
  ADMIN(Set.of(
          ADMIN_READ,
          ADMIN_UPDATE,
          ADMIN_DELETE,
          ADMIN_CREATE

  )),
  SUPERADMIN(
          Set.of(
                  ADMIN_READ,
                  ADMIN_UPDATE,
                  ADMIN_DELETE,
                  ADMIN_CREATE,
                  SUPERADMIN_DELETE,
                  SUPERADMIN_READ,
                  SUPERADMIN_UPDATE,
                  SUPERADMIN_CREATE
  )),

  SUSER(
          Set.of(
          SUSER_READ,
          SUSER_CREATE,
          SUSER_DELETE,
          SUSER_UPDATE
  ))
  ;
  @Getter
  private final Set<Permission> permissions;

  public List<SimpleGrantedAuthority> getAuthorities() {
    var authorities = getPermissions()
            .stream()
            .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
            .collect(Collectors.toList());
    authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
    System.out.println("this is the authorities" + authorities);
    return authorities;
  }


}
