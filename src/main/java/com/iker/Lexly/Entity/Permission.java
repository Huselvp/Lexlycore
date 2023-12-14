package com.iker.Lexly.Entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Permission {

    ADMIN_READ("admin:read"),
    ADMIN_UPDATE("admin:update"),
    ADMIN_CREATE("admin:create"),
    ADMIN_DELETE("admin:delete"),
    SUPERADMIN_READ("suser:read"),
    SUPERADMIN_UPDATE("suser:update"),
    SUPERADMIN_CREATE("suser:create"),
    SUPERADMIN_DELETE("suser:delete"),
    SUSER_CREATE("user:create"),
    SUSER_UPDATE("user:update"),
    SUSER_DELETE("user:delete"),
    SUSER_READ("user:read")

    ;

    @Getter
    private final String permission;
}
