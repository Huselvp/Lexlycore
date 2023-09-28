package com.iker.Lexly.Entity.enums;

public enum CaseType {
        PRIVATE_CASE("Private Case", Subtype.FAMILY, Subtype.RESIDENCE, Subtype.OTHER_THINGS),
        BUSINESS_CASE("Business Case", Subtype.MY_BUSINESS, Subtype.TRADE, Subtype.OTHER_THINGS);

        private final String displayName;
        private final Subtype[] subtypes;

        CaseType(String displayName, Subtype... subtypes) {
            this.displayName = displayName;
            this.subtypes = subtypes;
        }

        public String getDisplayName() {
            return displayName;
        }
        public Subtype[] getSubtypes() {
            return subtypes;
        }

        }



