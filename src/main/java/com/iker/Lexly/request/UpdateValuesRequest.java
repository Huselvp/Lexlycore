package com.iker.Lexly.request;

import com.iker.Lexly.DTO.DocumentQuestionValueDTO;

import java.util.List;

public class UpdateValuesRequest {
    private Long documentId;
    private List<DocumentQuestionValueDTO> values;

    public Long getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
    }

    public List<DocumentQuestionValueDTO> getValues() {
        return values;
    }

    public void setValues(List<DocumentQuestionValueDTO> values) {
        this.values = values;
    }
}

