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
    }


