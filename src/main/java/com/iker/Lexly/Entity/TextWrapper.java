package com.iker.Lexly.Entity;

import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class TextWrapper {
    private String text;


    public TextWrapper() {
    }

    public TextWrapper(String text) {
        this.text = text;
    }
}
