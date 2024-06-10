package com.iker.Lexly.service;

import com.iker.Lexly.Entity.DocumentQuestionValue;
import com.iker.Lexly.Entity.Documents;
import com.iker.Lexly.Entity.Question;
import com.iker.Lexly.Entity.SubQuestion;
import com.iker.Lexly.repository.*;
import com.iker.Lexly.request.AddValuesRequest;
import com.iker.Lexly.request.DayRequest;
import com.iker.Lexly.request.FormValues;
import com.iker.Lexly.request.UserInputs;
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
public class DocumentQuestionValueService {

    private final DocumentsRepository documentsRepository;

    private final QuestionRepository questionRepository;
    private final DocumentQuestionValueRepository documentQuestionValueRepository;
    private final QuestionService questionService;
    private final DocumentSubQuestionValueService documentSubQuestionValueService;

    @Autowired
    public DocumentQuestionValueService(DocumentQuestionValueRepository documentQuestionValueRepository, QuestionRepository questionRepository, DocumentsRepository documentsRepository, QuestionService questionService, DocumentSubQuestionValueService documentSubQuestionValueService) {
        this.questionRepository = questionRepository;
        this.documentsRepository = documentsRepository;
        this.documentQuestionValueRepository = documentQuestionValueRepository;
        this.questionService = questionService;
        this.documentSubQuestionValueService = documentSubQuestionValueService;
    }

        @Transactional
        public ApiResponse addValues(AddValuesRequest request) {
            Documents document = documentsRepository.findById(request.getDocumentId()).orElse(null);

            if (document == null) {
                return new ApiResponse("Document not found.", null);
            }

            document.setDraft(request.isDraft());

            for (UserInputs valueDto : request.getValues()) {
                if (!processQuestionValue(valueDto, document)) {
                    return new ApiResponse("Failed to add some values.", null);
                }
            }

            return new ApiResponse("Values added successfully.", null);
        }

        private boolean processQuestionValue(UserInputs valueDto, Documents document) {
            Long questionId = valueDto.getQuestionId();
            Question currentQuestion = questionRepository.findById(questionId).orElse(null);

            if (currentQuestion == null) {
                return false;
            }

            boolean result = processBasedOnQuestionType(currentQuestion, document, valueDto);

            if (!result) {
                return false;
            }

            if (!currentQuestion.getSubQuestions().isEmpty()) {
                return documentSubQuestionValueService.processSubQuestionValues(valueDto.getSubquestionsValues(), document);
            }

            return true;
        }

        private boolean processBasedOnQuestionType(Question question, Documents document, UserInputs valueDto) {
            String questionType = question.getValueType().split("/")[0];

            return switch (questionType) {
                case "form" -> processFormQuestionValue(question, document, valueDto);
                case "time" -> processTimeQuestionValue(question, document, valueDto);
                case "checkbox" -> processCheckboxQuestionValue(question, document, valueDto);
                case "day" -> processDayQuestionValue(question, document, valueDto);
                default -> processDefaultQuestionValue(question, document, valueDto);
            };
        }

        private boolean processFormQuestionValue(Question question, Documents document, UserInputs valueDto) {
            List<FormValues> formValues = valueDto.getFormValues();
            StringBuilder valueBuilder = new StringBuilder("form");

            for (FormValues formValue : formValues) {
                valueBuilder.append("/")
                        .append(formValue.getBlockId())
                        .append("/")
                        .append(formValue.getLabelId())
                        .append("/")
                        .append(formValue.getLabelValue());
            }

            saveDocumentQuestionValue(question, document, valueBuilder.toString());
            return true;
        }

        private boolean processTimeQuestionValue(Question question, Documents document, UserInputs valueDto) {
            String value = String.format("time/%s/%s", valueDto.getFirstTimeValues(), valueDto.getSecondTimeValue());
            saveDocumentQuestionValue(question, document, value);
            return true;
        }

        private boolean processCheckboxQuestionValue(Question question, Documents document, UserInputs valueDto) {
            String value = "checkbox" + valueDto.getCheckboxValue().stream()
                    .map(val -> "/" + val)
                    .collect(Collectors.joining());

            saveDocumentQuestionValue(question, document, value);
            return true;
        }

        private boolean processDayQuestionValue(Question question, Documents document, UserInputs valueDto) {
            List<DayRequest> days = Optional.ofNullable(valueDto.getDays()).orElse(Collections.emptyList());

            if (days.size() < 2) {
                return false;
            }

            days.sort(Comparator.comparingLong(DayRequest::getIndex));
            Long duration = questionService.calculateDuration(days.get(0).getIndex(), days.get(1).getIndex());
            String value = constructDayValueString(days, duration);

            saveDocumentQuestionValue(question, document, value);
            return true;
        }

        private String constructDayValueString(List<DayRequest> days, Long duration) {
            return String.format("day/%s/%s/%d", days.get(0).getDay(), days.get(1).getDay(), duration);
        }

        private boolean processDefaultQuestionValue(Question question, Documents document, UserInputs valueDto) {
            String value = question.getValueType() + "/" + valueDto.getValue();
            saveDocumentQuestionValue(question, document, value);
            return true;
        }

        private void saveDocumentQuestionValue(Question question, Documents document, String value) {
            DocumentQuestionValue newValue = new DocumentQuestionValue(question, document, value);
            documentQuestionValueRepository.save(newValue);
        }

        @Transactional
        public ApiResponse updateValues(Long documentQuestionValueId, UserInputs newValue) {
            Optional<DocumentQuestionValue> optionalExistingValue = documentQuestionValueRepository.findById(documentQuestionValueId);

            if (optionalExistingValue.isEmpty()) {
                return new ApiResponse("Value not found.", null);
            }

            DocumentQuestionValue existingDocumentQuestionValue = optionalExistingValue.get();
            Question currentQuestion = existingDocumentQuestionValue.getQuestion();

            return updateBasedOnQuestionType(existingDocumentQuestionValue, newValue, currentQuestion);
        }

        private ApiResponse updateBasedOnQuestionType(DocumentQuestionValue existingValue, UserInputs newValue, Question currentQuestion) {
            String questionType = currentQuestion.getValueType().split("/")[0];

            return switch (questionType) {
                case "form" -> updateFormValuesToQuestion(existingValue, newValue);
                case "time" -> updateTimeQuestionValue(existingValue, newValue);
                case "checkbox" -> updateCheckboxQuestionValue(existingValue, newValue);
                case "day" -> updateDayQuestionValue(existingValue, newValue);
                default -> updateDefaultQuestionValue(existingValue, newValue);
            };
        }

        private ApiResponse updateFormValuesToQuestion(DocumentQuestionValue existingValue, UserInputs newValue) {
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
            documentQuestionValueRepository.save(existingValue);
            return new ApiResponse("Form values updated successfully.", null);
        }

        private ApiResponse updateTimeQuestionValue(DocumentQuestionValue existingValue, UserInputs newValue) {
            LocalTime firstTimeValue = newValue.getFirstTimeValues();
            LocalTime secondTimeValue = newValue.getSecondTimeValue();

            if (firstTimeValue == null || secondTimeValue == null) {
                return new ApiResponse("Time values are missing.", null);
            }

            String updatedValue = String.format("time/%s/%s", firstTimeValue, secondTimeValue);
            existingValue.setValue(updatedValue);
            documentQuestionValueRepository.save(existingValue);
            return new ApiResponse("Time values updated successfully.", null);
        }

        private ApiResponse updateCheckboxQuestionValue(DocumentQuestionValue existingValue, UserInputs newValue) {
            List<String> checkboxValues = newValue.getCheckboxValue();

            if (checkboxValues == null || checkboxValues.isEmpty()) {
                return new ApiResponse("Checkbox values are missing.", null);
            }

            String updatedValue = "checkbox" + checkboxValues.stream()
                    .map(val -> "/" + val)
                    .collect(Collectors.joining());

            existingValue.setValue(updatedValue);
            documentQuestionValueRepository.save(existingValue);
            return new ApiResponse("Checkbox values updated successfully.", null);
        }

        private ApiResponse updateDayQuestionValue(DocumentQuestionValue existingValue, UserInputs newValue) {
            List<DayRequest> days = Optional.ofNullable(newValue.getDays()).orElse(Collections.emptyList());

            if (days.size() < 2) {
                return new ApiResponse("Day values are missing.", null);
            }

            days.sort(Comparator.comparingLong(DayRequest::getIndex));
            Long duration = questionService.calculateDuration(days.get(0).getIndex(), days.get(1).getIndex());
            String updatedValue = constructDayValueString(days, duration);

            existingValue.setValue(updatedValue);
            documentQuestionValueRepository.save(existingValue);
            return new ApiResponse("Day values updated successfully.", null);
        }

        private ApiResponse updateDefaultQuestionValue(DocumentQuestionValue existingValue, UserInputs newValue) {
            String value = newValue.getValue();

            if (value == null || value.isEmpty()) {
                return new ApiResponse("Value is missing.", null);
            }
            String valueWithType=existingValue.getQuestion().getValueType()+"/"+value;
            existingValue.setValue(valueWithType);
            documentQuestionValueRepository.save(existingValue);
            return new ApiResponse("Values updated successfully.", null);
        }
    }


//    private boolean processDateQuestionValue(Question currentQuestion, Documents document, DocumentQuestionValueDTO valueDto) {
//        String dateValue = valueDto.getDateValue().toString();
//
//        if (dateValue == null) {
//            return false;
//        }
//        dateValue= currentQuestion.getValueType() + "/" +  dateValue;
//        DocumentQuestionValue newDateValue = new DocumentQuestionValue(currentQuestion, document,dateValue);
//        documentQuestionValueRepository.save(newDateValue);
//        return true;
//    }
//
//    private boolean processFilterQuestionValue(Question currentQuestion, Documents document, DocumentQuestionValueDTO valueDto) {
//        Filter filter = filterService.getFilterByQuestionId(currentQuestion.getId());
//
//        if (filter == null) {
//            return false;
//        }
//
//        Object filterValue = switch (filter.getFilterType()) {
//            case INTEGER -> valueDto.getIntFilterValue();
//            case DOUBLE -> valueDto.getDoubleFilterValue();
//
//        };
//
//        if (filterValue != null) {
//            DocumentQuestionValue newFilterValue = new DocumentQuestionValue(currentQuestion, document, filterValue);
//            documentQuestionValueRepository.save(newFilterValue);
//            return true;
//        }
//
//        return false;
//    }

//    private ApiResponse updateDateQuestionValue(DocumentQuestionValue existingValue, DocumentQuestionValueDTO newValue) {
//        LocalDate dateValue = newValue.getDateValue();
//
//        if (dateValue == null) {
//            return new ApiResponse("Date value is missing.", null);
//        }
//
//        existingValue.setDateValue(dateValue);
//        documentQuestionValueRepository.save(existingValue);
//        return new ApiResponse("Date value updated successfully.", null);
//    }
//
//    private ApiResponse updateFilterQuestionValue(DocumentQuestionValue existingValue, DocumentQuestionValueDTO newValue) {
//        Filter filter = filterService.getFilterByQuestionId(existingValue.getQuestion().getId());
//        if (filter == null) {
//            return new ApiResponse("Filter not found.", null);
//        }
//        if (filter.getFilterType() == FilterType.INTEGER) {
//            Integer intFilterValue = newValue.getIntFilterValue();
//            if (intFilterValue == null) {
//                return new ApiResponse("Integer filter value is missing.", null);
//            }
//            existingValue.setIntFilterValue(intFilterValue);
//        } else {
//            Double doubleFilterValue = newValue.getDoubleFilterValue();
//            if (doubleFilterValue == null) {
//                return new ApiResponse("Double filter value is missing.", null);
//            }
//            existingValue.setDoubleFilterValue(doubleFilterValue);
//        }
//        documentQuestionValueRepository.save(existingValue);
//        return new ApiResponse("Filter values updated successfully.", null);
//    }

