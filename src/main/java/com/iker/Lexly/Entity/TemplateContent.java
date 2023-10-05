package com.iker.Lexly.Entity;

import java.util.List;

public class TemplateContent {
    private String username;
    private String email;
    private String country;
    private String phoneNumber;
    private List<String> content;
    public TemplateContent(String username, String email, String country, String phoneNumber, List<String> content) {
        this.username = username;
        this.email = email;
        this.country = country;
        this.phoneNumber = phoneNumber;
        this.content = content;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    public String getCountry() {
        return country;
    }
    public void setCountry(String country) {
        this.country = country;
    }
    public String getPhoneNumber() {
        return phoneNumber;
    }
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    public List<String> getContent() {
        return content;
    }
    public void setContent(List<String> content) {
        this.content = content;
    }
    @Override
    public String toString() {
        return "TemplateContent{" +
                "username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", country='" + country + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", content=" + content +
                '}';
    }
}

