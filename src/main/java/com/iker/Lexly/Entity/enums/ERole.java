package com.iker.Lexly.Entity.enums;

public enum ERole {
  ADMIN,
  SUPERADMIN,
  ADVISOR,
  SUSER
  ;

  public static ERole trimName(String roleName) {
    if (roleName != null) {
      roleName = roleName.trim();
      for (ERole role : values()) {
        if (role.name().equalsIgnoreCase(roleName)) {
          return role;
        }
      }
    }
    return null; // Return null if the role name is not found or is null/empty after trimming.
  }
}
