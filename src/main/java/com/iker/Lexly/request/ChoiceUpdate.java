package com.iker.Lexly.request;

public class ChoiceUpdate {
    private int choiceId;
    private String newRelatedText;

    public int getChoiceId() {
        return choiceId;
    }

    public void setChoiceId(int choiceId) {
        this.choiceId = choiceId;
    }

    public String getNewRelatedText() {
        return newRelatedText;
    }

    public void setNewRelatedText(String newRelatedText) {
        this.newRelatedText = newRelatedText;
    }
}

