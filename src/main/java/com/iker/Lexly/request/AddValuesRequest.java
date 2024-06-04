package com.iker.Lexly.request;

import com.iker.Lexly.DTO.DocumentQuestionValueDTO;

import java.util.List;

public class AddValuesRequest {
    private Long documentId;
    private List<DocumentQuestionValueDTO> values;
    private boolean isDraft;



    public AddValuesRequest(Long documentId, List<DocumentQuestionValueDTO> values, boolean isDraft,List<FormValuesRequest> formsValues) {
        this.documentId = documentId;
        this.values = values;
        this.isDraft = isDraft;
    }



    public Long getDocumentId() {
        return documentId;
    }

    public List<DocumentQuestionValueDTO> getValues() {
        return values;
    }

    public boolean isDraft() {
        return isDraft;
    }

    public void setDraft(boolean draft) {
        isDraft = draft;
    }
}