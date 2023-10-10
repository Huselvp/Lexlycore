package com.iker.Lexly.Entity.enums;

import lombok.Getter;

public enum Permissions {
    SUPERADMIN_READ("superadmin:read"),
    SUPERADMIN_UPDATE("superadmin:update"),
    SUPERTADMIN_CREATE("superadmin:create"),
    SUPERADMIN_DELETE("superadmin:delete"),
    ADMIN_READ("admin:read"),
    ADMIN_UPDATE("admin:update"),
    ADMIN_CREATE("admin:create"),
    ;
    @Getter
    private final String permission;

    Permissions(String permission) {
        this.permission = permission;
    }

    public String getPermission() {
        return permission;
    }

    }

