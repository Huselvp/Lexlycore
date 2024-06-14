package com.iker.Lexly.Entity;

public class Checkout {
    private String integrationType="EmbeddedCheckout";
    private String url="http://localhost:3000/pay";
    private String termsUrl="http://localhost:8000/terms";
    private String countryCode="DNK";

    public String getIntegrationType() {
        return integrationType;
    }

    public void setIntegrationType(String integrationType) {
        this.integrationType = integrationType;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getTermsUrl() {
        return termsUrl;
    }

    public void setTermsUrl(String termsUrl) {
        this.termsUrl = termsUrl;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }
}

