package com.iker.Lexly.Entity.enums;

public enum Permissions {
    READ_DOCUMENT("READ_DOCUMENT"),
    WRITE_DOCUMENT("WRITE_DOCUMENT"),
    UPLOAD_DOCUMENT("UPLOAD_DOCUMENT"),
    DELETE_DOCUMENT("DELETE_DOCUMENT");

    private final String permission;

    Permissions(String permission) {
        this.permission = permission;
    }

    public String getPermission() {
        return permission;
    }

    }

