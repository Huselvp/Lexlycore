package com.iker.Lexly.responses;

public class GuestDocumentResponse {
    private String message;

    public GuestDocumentResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
