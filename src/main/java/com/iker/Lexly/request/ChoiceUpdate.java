package com.iker.Lexly.request;

public class ChoiceUpdate {
    private int choiceId;

    private String choice;
    private String newRelatedText;

    public int getChoiceId() {
        return choiceId;
    }

    public void setChoiceId(int choiceId) {
        this.choiceId = choiceId;
    }
    public String getChoice(){
        return choice;

    }
    public void setChoice(String choice) {
        this.choice = choice;
    }

    public String getNewRelatedText() {
        return newRelatedText;
    }

    public void setNewRelatedText(String newRelatedText) {
        this.newRelatedText = newRelatedText;
    }
}

