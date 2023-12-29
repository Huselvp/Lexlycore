package com.iker.Lexly.request;

import com.iker.Lexly.DTO.DocumentQuestionValueDTO;

import java.util.List;

public class AddValuesRequest {
    private Long documentId;
    private List<DocumentQuestionValueDTO> values;


    public AddValuesRequest(Long documentId, List<DocumentQuestionValueDTO> values) {
        this.documentId = documentId;
        this.values = values;
    }

    public Long getDocumentId() {
        return documentId;
    }

    public List<DocumentQuestionValueDTO> getValues() {
        return values;
    }

    public static class ValueDTO {
        private Long questionId;
        private String value;

        public ValueDTO(Long questionId, String value) {
            this.questionId = questionId;
            this.value = value;
        }
    }
}