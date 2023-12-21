package com.iker.Lexly.request;

public class UpdateEmailPassword {
    private String currentPassword;
    private String email;
    private String newPassword;


    public String getCurrentPassword() {
        return currentPassword;
    }

    public String getEmail() {
        return email;
    }

    public String getNewPassword() {
        return newPassword;
    }

    // Setters

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
