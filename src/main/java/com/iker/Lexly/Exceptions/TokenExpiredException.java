package com.iker.Lexly.Exceptions;



public class TokenExpiredException extends RuntimeException {

    public TokenExpiredException(String message) {
        super(message);
    }
}

