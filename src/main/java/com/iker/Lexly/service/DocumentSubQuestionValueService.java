package com.iker.Lexly.service;

import com.iker.Lexly.Entity.*;
import com.iker.Lexly.repository.DocumentSubQuestionValueRepository;

import com.iker.Lexly.repository.SubQuestionRepository;
import com.iker.Lexly.request.DayRequest;
import com.iker.Lexly.request.FormValues;
import com.iker.Lexly.request.UserInputs;
import com.iker.Lexly.request.UserInputsSubQuestion;
import com.iker.Lexly.responses.ApiResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DocumentSubQuestionValueService {

    private final DocumentSubQuestionValueRepository documentSubQuestionValueRepository;
    private final SubQuestionRepository subQuestionRepository;
    private final QuestionService questionService;
    @Autowired
    public DocumentSubQuestionValueService(DocumentSubQuestionValueRepository documentSubQuestionValueRepository, SubQuestionRepository subQuestionRepository, QuestionService questionService) {
        this.documentSubQuestionValueRepository = documentSubQuestionValueRepository;
        this.subQuestionRepository = subQuestionRepository;

        this.questionService = questionService;
    }
    @Transactional
    public boolean processSubQuestionValues(List<UserInputsSubQuestion> subquestionsValues, Documents document) {
        if (subquestionsValues == null) {
            return false;
        }
            for (UserInputsSubQuestion subValueDto : subquestionsValues) {
                    processSubQuestionValue(subValueDto,document) ;
            }
        return true;

    }

    private boolean processSubQuestionValue(UserInputsSubQuestion subValueDto, Documents document) {
        Long subQuestionId = subValueDto.getSubQuestionId();
        SubQuestion subQuestion = subQuestionRepository.findById(subQuestionId).orElse(null);

        if (subQuestion == null) {
            return false;
        }

        String subQuestionType = subQuestion.getValueType();

        return switch (subQuestionType.split("/")[0]) {
            case "form" -> processFormSubQuestionValue(subQuestion, document, subValueDto);
            case "time" -> processTimeSubQuestionValue(subQuestion, document, subValueDto);
            case "checkbox" -> processCheckboxSubQuestionValue(subQuestion, document, subValueDto);
            default -> processDefaultSubQuestionValue(subQuestion, document, subValueDto);
        };
    }

    private boolean processFormSubQuestionValue(SubQuestion subQuestion,Documents document, UserInputsSubQuestion valueDto) {
        List<FormValues> formValues = valueDto.getFormValues();

        if (formValues == null || formValues.isEmpty()) {
            return false;
        }

        StringBuilder valueBuilder = new StringBuilder("form");
        for (FormValues formValue : formValues) {
            valueBuilder.append("/")
                    .append(formValue.getBlockId())
                    .append("/")
                    .append(formValue.getLabelId())
                    .append("/")
                    .append(formValue.getLabelValue());
        }
        saveDocumentSubQuestionValue(subQuestion, document, valueBuilder.toString());
        return true;
    }

    private boolean processTimeSubQuestionValue(SubQuestion subQuestion, Documents document, UserInputsSubQuestion valueDto) {
        LocalTime firstTimeValue = valueDto.getFirstTimeValues();
        LocalTime secondTimeValue = valueDto.getSecondTimeValue();

        if (firstTimeValue == null || secondTimeValue == null) {
            return false;
        }

        String value = String.format("time/%s/%s", firstTimeValue, secondTimeValue);
        saveDocumentSubQuestionValue( subQuestion, document, value);
        return true;
    }

    private boolean processCheckboxSubQuestionValue(SubQuestion subQuestion, Documents document, UserInputsSubQuestion valueDto) {
        List<String> checkboxValues = valueDto.getCheckboxValue();

        if (checkboxValues == null || checkboxValues.isEmpty()) {
            return false;
        }

        String value = "checkbox" + checkboxValues.stream()
                .map(val -> "/" + val)
                .collect(Collectors.joining());

        saveDocumentSubQuestionValue(subQuestion, document, value);
        return true;
    }

    private void processDaySubQuestionValue(SubQuestion subQuestion, Documents document, UserInputs valueDto) {
        List<DayRequest> days = Optional.ofNullable(valueDto.getDays()).orElse(Collections.emptyList());

        if (days.size() < 2) {
            return;
        }

        days.sort(Comparator.comparingLong(DayRequest::getIndex));


        Long duration = questionService.calculateDuration(days.get(0).getIndex(), days.get(1).getIndex());
        String value = constructDayValueString(days, duration);

        saveDocumentSubQuestionValue(subQuestion, document, value);
    }

    private String constructDayValueString(List<DayRequest> days, Long duration) {
        return String.format("day/%s/%s/%d", days.get(0).getDay(), days.get(1).getDay(), duration);
    }

    private boolean processDefaultSubQuestionValue(SubQuestion subQuestion, Documents document, UserInputsSubQuestion valueDto) {
        String value = subQuestion.getValueType() + "/" + valueDto.getValue();
        saveDocumentSubQuestionValue(subQuestion, document, value);
        return true;
    }

    private void saveDocumentSubQuestionValue(SubQuestion subQuestion, Documents document, String value) {
        DocumentSubQuestionValue newValue = new DocumentSubQuestionValue(subQuestion, document, value);
        documentSubQuestionValueRepository.save(newValue);
    }
    @Transactional
    public ApiResponse updateSubQuestionValues(Long documentSubQuestionValueId, UserInputsSubQuestion newValue) {
        Optional<DocumentSubQuestionValue> optionalExistingValue = documentSubQuestionValueRepository.findById(documentSubQuestionValueId);

        if (optionalExistingValue.isEmpty()) {
            return new ApiResponse("Subquestion value not found.", null);
        }

        DocumentSubQuestionValue existingSubQuestionValue = optionalExistingValue.get();
        SubQuestion subQuestion = existingSubQuestionValue.getSubQuestion();

        return updateBasedOnSubQuestionType(existingSubQuestionValue, newValue, subQuestion);
    }

    private ApiResponse updateBasedOnSubQuestionType(DocumentSubQuestionValue existingValue, UserInputsSubQuestion newValue, SubQuestion subQuestion) {
        String subQuestionType = subQuestion.getValueType().split("/")[0];

        return switch (subQuestionType) {
            case "form" -> updateFormSubQuestionValue(existingValue, newValue);
            case "time" -> updateTimeSubQuestionValue(existingValue, newValue);
            case "checkbox" -> updateCheckboxSubQuestionValue(existingValue, newValue);
            default -> updateDefaultSubQuestionValue(existingValue, newValue);
        };
    }

    private ApiResponse updateFormSubQuestionValue(DocumentSubQuestionValue existingValue, UserInputsSubQuestion newValue) {
        List<FormValues> formValues = newValue.getFormValues();

        if (formValues == null || formValues.isEmpty()) {
            return new ApiResponse("Form values are missing.", null);
        }

        String updatedValue = existingValue.getValue();

        for (FormValues formValue : formValues) {
            String newValueString = formValue.getBlockId() + "/" + formValue.getLabelId() + "/" + formValue.getLabelValue();
            String regex = "\\b" + formValue.getBlockId() + "/" + formValue.getLabelId() + "/[^/]+\\b";
            updatedValue = updatedValue.replaceAll(regex, newValueString);
        }

        existingValue.setValue(updatedValue);
        documentSubQuestionValueRepository.save(existingValue);
        return new ApiResponse("Form subquestion values updated successfully.", null);
    }

    private ApiResponse updateTimeSubQuestionValue(DocumentSubQuestionValue existingValue, UserInputsSubQuestion newValue) {
        LocalTime firstTimeValue = newValue.getFirstTimeValues();
        LocalTime secondTimeValue = newValue.getSecondTimeValue();

        if (firstTimeValue == null || secondTimeValue == null) {
            return new ApiResponse("Time values are missing.", null);
        }

        String updatedValue = String.format("time/%s/%s", firstTimeValue, secondTimeValue);
        existingValue.setValue(updatedValue);
        documentSubQuestionValueRepository.save(existingValue);
        return new ApiResponse("Time subquestion values updated successfully.", null);
    }

    private ApiResponse updateCheckboxSubQuestionValue(DocumentSubQuestionValue existingValue, UserInputsSubQuestion newValue) {
        List<String> checkboxValues = newValue.getCheckboxValue();

        if (checkboxValues == null || checkboxValues.isEmpty()) {
            return new ApiResponse("Checkbox values are missing.", null);
        }

        String updatedValue = "checkbox" + checkboxValues.stream()
                .map(val -> "/" + val)
                .collect(Collectors.joining());

        existingValue.setValue(updatedValue);
        documentSubQuestionValueRepository.save(existingValue);
        return new ApiResponse("Checkbox subquestion values updated successfully.", null);
    }

    private ApiResponse updateDefaultSubQuestionValue(DocumentSubQuestionValue existingValue, UserInputsSubQuestion newValue) {
        String value = newValue.getValue();

        if (value == null || value.isEmpty()) {
            return new ApiResponse("Value is missing.", null);
        }
        String valueWithType= existingValue.getSubQuestion().getValueType()+"/"+value;
        existingValue.setValue(valueWithType);
        documentSubQuestionValueRepository.save(existingValue);
        return new ApiResponse("Subquestion values updated successfully.", null);
    }
}
