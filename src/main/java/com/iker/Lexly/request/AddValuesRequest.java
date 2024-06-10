package com.iker.Lexly.request;

import com.iker.Lexly.DTO.DocumentQuestionValueDTO;

import java.util.List;

public class AddValuesRequest {
    private Long documentId;
    private List<UserInputs> values;
    private boolean isDraft;



    public AddValuesRequest(Long documentId, List<UserInputs> values, boolean isDraft) {
        this.documentId = documentId;
        this.values = values;
        this.isDraft = isDraft;
    }



    public Long getDocumentId() {
        return documentId;
    }

    public List<UserInputs>getValues() {
        return values;
    }

    public boolean isDraft() {
        return isDraft;
    }

    public void setDraft(boolean draft) {
        isDraft = draft;
    }
}