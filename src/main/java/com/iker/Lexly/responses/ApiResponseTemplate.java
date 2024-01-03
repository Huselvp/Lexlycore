package com.iker.Lexly.responses;

import com.iker.Lexly.Entity.Template;

public class ApiResponseTemplate {
    private String message;
    private Template template;


    public ApiResponseTemplate(String message, Template template) {
        this.message = message;
        this.template = template;
    }
}
