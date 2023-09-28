package com.iker.Lexly.Entity.enums;

public enum Subtype {
    FAMILY("Family"),
    RESIDENCE("Residence"),
    OTHER_THINGS("Other Things"),
    MY_BUSINESS("My Business"),
    TRADE("Trade");

    private final String displayName;

    Subtype(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

