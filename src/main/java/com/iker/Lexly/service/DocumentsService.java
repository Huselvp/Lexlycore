package com.iker.Lexly.service;

import com.iker.Lexly.DTO.DocumentQuestionValueDTO;
import com.iker.Lexly.Entity.*;
import com.iker.Lexly.Entity.Form.Block;
import com.iker.Lexly.Entity.Form.Form;
import com.iker.Lexly.Entity.enums.FilterType;
import com.iker.Lexly.config.jwt.JwtService;
import com.iker.Lexly.repository.*;
import com.iker.Lexly.repository.form.BlockRepository;
import com.iker.Lexly.repository.form.FormRepository;
import com.iker.Lexly.request.AddValuesRequest;
import com.iker.Lexly.request.FormValues;
import com.iker.Lexly.responses.ApiResponse;
import com.iker.Lexly.responses.ApiResponseDocuments;
import com.iker.Lexly.service.form.BlockService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.xhtmlrenderer.pdf.ITextRenderer;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

import java.util.stream.Collectors;

@Service
@Transactional
public class DocumentsService {
    private static final Logger logger = LoggerFactory.getLogger(DocumentsService.class);
    private final DocumentsRepository documentsRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final TemplateRepository templateRepository;
    private final QuestionRepository questionRepository;
    private final DocumentQuestionValueRepository documentQuestionValueRepository;
    private final BlockRepository blockRepository;
    private final BlockService blockService;
    private final FormRepository formRepository;
    private final FilterService filterService;

    @Autowired
    public DocumentsService(DocumentQuestionValueRepository documentQuestionValueRepository, QuestionRepository questionRepository, TemplateRepository templateRepository, UserRepository userRepository, DocumentsRepository documentsRepository, JwtService jwtService, BlockRepository blockRepository, BlockService blockService , FormRepository formRepository, FilterService filterService) {
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
        this.templateRepository = templateRepository;
        this.documentsRepository = documentsRepository;
        this.documentQuestionValueRepository = documentQuestionValueRepository;
        this.jwtService = jwtService;
        this.blockRepository=blockRepository;
        this.blockService=blockService;
        this.formRepository = formRepository;
        this.filterService = filterService;
    }


    public List<Documents> getDocumentsByUserId(String token) {
        if (jwtService.isTokenExpired(token)) {
            return Collections.emptyList();
        }
        String username = jwtService.extractUsername(token);
        User user = userRepository.findByUsername(username).orElse(null);
        if (user != null) {
            Long userId = user.getId();
            List<Documents> documents = documentsRepository.findByUserId(userId);

            return new ArrayList<>(documents);
        } else {
            return Collections.emptyList();
        }
    }
    public ApiResponseDocuments createNewDocument(Long templateId, Long userId) {
        Template template = templateRepository.findById(templateId).orElse(null);

        if (template != null) {
            User user = userRepository.findById(Math.toIntExact(userId)).orElse(null);
            if (user != null) {
                Documents document = new Documents();
                document.setTemplate(template);
                document.setCreatedAt(LocalDateTime.now());
                document.setDraft(true);
                document.setUser(user);
                Documents savedDocument = documentsRepository.save(document);
                logger.info("Document has been created successfully {}",savedDocument);
                return new ApiResponseDocuments("Document created successfully.", savedDocument.getId());
            } else {
                return new ApiResponseDocuments("User not found.", null);
            }
        } else {
            return new ApiResponseDocuments("Template not found.", null);
        }
    }
//    public String documentProcess(List<Question> questions, Long documentId, Long templateId, List<DocumentQuestionValue> documentQuestionValues) {
//        Documents document = documentsRepository.findById(documentId)
//                .orElseThrow(() -> new RuntimeException("Document not found"));
//
//        List<Integer> questionOrder = document.getQuestionOrder();
//        if (questionOrder == null || questionOrder.isEmpty()) {
//            return "Question order not specified.";
//        }
//
//        if (!isExist(documentId, documentQuestionValues)) {
//            return "Invalid documentId or document not found.";
//        }
//        Document mainDocument = Jsoup.parse("<div></div>");
//        for (Integer questionId : questionOrder) {
//            Question question = findQuestionById(questions, questionId);
//            if (question != null && question.getTemplate().getId().equals(templateId)) {
//                String text = question.getTexte();
//                text = replaceValues(text, question.getId(), documentQuestionValues);
//                Document questionDocument = Jsoup.parseBodyFragment(text);
//                for (org.jsoup.nodes.Node child : questionDocument.body().childNodes()) {
//                    mainDocument.body().appendChild(child.clone());
//                }
//            }
//        }
//
//        return mainDocument.html().trim();
//    }


    public String documentProcess(List<Question> questions, Long documentId, Long templateId, List<DocumentQuestionValue> documentQuestionValues) {
        if (!isExist(documentId, documentQuestionValues)) {
            return "Invalid documentId or document not found.";
        }
        questions.sort(Comparator.comparingInt(Question::getPosition));
        Document mainDocument = Jsoup.parse("<div></div>");
        for (Question question : questions) {
            if (question != null && question.getTemplate().getId().equals(templateId)) {
                String text = question.getTexte();
                text = replaceValues(text, question.getId(), documentQuestionValues);
                Document questionDocument = Jsoup.parseBodyFragment(text);
                for (org.jsoup.nodes.Node child : questionDocument.body().childNodes()) {
                    mainDocument.body().appendChild(child.clone());
                }
            }
        }

        return mainDocument.html().trim();
    }
//    public String replaceValues(String text, Long questionId, List<DocumentQuestionValue> documentQuestionValues) {
//        for (DocumentQuestionValue documentQuestionValue : documentQuestionValues) {
//            if (documentQuestionValue != null && documentQuestionValue.getQuestion().getId().equals(questionId)) {
//                if (documentQuestionValue.getValue() != null) {
//                    if (documentQuestionValue.getQuestion().getValueType().equals("form")) {
//                        Optional<Form> formOptional = formRepository.findByQuestionId(questionId);
//                        if (formOptional.isPresent()) {
//                            Form form = formOptional.get();
//
//                            List<Block> blocksOfForm = blockRepository.findByFormId(form.getId());
//                            boolean areBlocksEqual = blockService.areBlocksEqual(form.getId());
//
//                            // If there are multiple blocks and they are equal we're going to duplicate the text for each block and replace the values
//                            if (blocksOfForm.size() > 1 && areBlocksEqual) {
//                                StringBuilder textBuilder = new StringBuilder();
//                                for (Block block : blocksOfForm) {
//                                    String blockText = text;
//                                    String concatenatedValues = documentQuestionValue.getValue();
//                                    String formPrefix = "form/";
//                                    String valueTypeWithoutForm = concatenatedValues.substring(formPrefix.length());
//                                    String[] values = valueTypeWithoutForm.split("/");
//
//                                    for (int i = 0; i < values.length; i += 3) {
//                                        int blockId = Integer.parseInt(values[i]);
//                                        String value = values[i + 2];
//                                        if (blockId == block.getId()) {
//                                            blockText = blockText.replaceFirst("\\[value\\]", value);
//                                        }
//                                    }
//                                    textBuilder.append(blockText).append(", ");
//                                }
//
//                                if (textBuilder.length() > 2) {
//                                    textBuilder.setLength(textBuilder.length() - 2);
//                                }
//                                text = textBuilder.toString();
//
//                            } else {
//                                StringBuilder textBuilder = new StringBuilder();
//                                String blockText = text;
//                                String values = documentQuestionValue.getValue();
//                                String formPrefix = "form/";
//                                String valueTypeWithoutForm = values.substring(formPrefix.length());
//                                String[] choices = valueTypeWithoutForm.split("/");
//                                for (int i = 0; i < choices.length; i += 3) {
//                                    String value = choices[i + 2];
//                                    blockText = blockText.replaceFirst("\\[value\\]", value);
//                                }
//
//                                textBuilder.append(blockText);
//                                text = textBuilder.toString();
//                            }
//                        }
//                    } else {
//                        text = text.replace("[value]", documentQuestionValue.getValue());
//                    }
//                } else {
//                    text = text.replace("[value]", "null");
//                }
//            }
//
//        }
//        return text;
//    }
//
//public String replaceValues(String text, Long questionId, List<DocumentQuestionValue> documentQuestionValues) {
//    for (DocumentQuestionValue documentQuestionValue : documentQuestionValues) {
//
//        if (documentQuestionValue.getValue() == null) {
//            text = text.replace("[value]", "null");
//        }
//
//        if (documentQuestionValue.getQuestion().getId().equals(questionId)) {
//                if (documentQuestionValue.getQuestion().getValueType().equals("form")) {
//                    Optional<Form> formOptional = formRepository.findByQuestionId(questionId);
//                    if (formOptional.isPresent()) {
//                        Form form = formOptional.get();
//
//                        List<Block> blocksOfForm = blockRepository.findByFormId(form.getId());
//                        boolean areBlocksEqual = blockService.areBlocksEqual(form.getId());
//
//                        // If there are multiple blocks and they are equal we're going to duplicate the text for each block and replace the values
//                        if (blocksOfForm.size() > 1 && areBlocksEqual) {
//                            StringBuilder textBuilder = new StringBuilder();
//                            for (Block block : blocksOfForm) {
//                                String blockText = text;
//                                String concatenatedValues = documentQuestionValue.getValue();
//                                String formPrefix = "form/";
//                                String valueTypeWithoutForm = concatenatedValues.substring(formPrefix.length());
//                                String[] values = valueTypeWithoutForm.split("/");
//
//                                for (int i = 0; i < values.length; i += 3) {
//                                    int blockId = Integer.parseInt(values[i]);
//                                    String value = values[i + 2];
//                                    if (blockId == block.getId()) {
//                                        blockText = blockText.replaceFirst("\\[value\\]", value);
//                                    }
//                                }
//                                textBuilder.append(blockText).append(", ");
//                            }
//
//                            if (textBuilder.length() > 2) {
//                                textBuilder.setLength(textBuilder.length() - 2);
//                            }
//                            text = textBuilder.toString();
//
//                        } else {
//                            StringBuilder textBuilder = new StringBuilder();
//                            String blockText = text;
//                            String values = documentQuestionValue.getValue();
//                            String formPrefix = "form/";
//                            String valueTypeWithoutForm = values.substring(formPrefix.length());
//                            String[] choices = valueTypeWithoutForm.split("/");
//                            for (int i = 0; i < choices.length; i += 3) {
//                                String value = choices[i + 2];
//                                blockText = blockText.replaceFirst("\\[value\\]", value);
//                            }
//
//                            textBuilder.append(blockText);
//                            text = textBuilder.toString();
//                        }
//                    }
//                } else {
//                    text = text.replace("[value]", documentQuestionValue.getValue());
//                }
//
//        }
//
//    }
//    return text;
//}

    public String replaceValues(String text, Long questionId, List<DocumentQuestionValue> documentQuestionValues) {
        for (DocumentQuestionValue documentQuestionValue : documentQuestionValues) {
            if (documentQuestionValue.getValue() == null) {
                text = text.replace("[value]", "null");
            } else if (documentQuestionValue.getQuestion().getId().equals(questionId)) {
                text = processDocumentQuestionValue(text, questionId, documentQuestionValue);
            }
        }
        return text;
    }

    private String processDocumentQuestionValue(String text, Long questionId, DocumentQuestionValue documentQuestionValue) {
        if ("form".equals(documentQuestionValue.getQuestion().getValueType())) {
            return processFormValue(text, questionId, documentQuestionValue);
        } else {
            return text.replace("[value]", documentQuestionValue.getValue());
        }
    }

    private String processFormValue(String text, Long questionId, DocumentQuestionValue documentQuestionValue) {
        Optional<Form> formOptional = formRepository.findByQuestionId(questionId);
        if (!formOptional.isPresent()) {
            return text;
        }
        Form form = formOptional.get();
        List<Block> blocksOfForm = blockRepository.findByFormId(form.getId());
        boolean areBlocksEqual = blockService.areBlocksEqual(form.getId());

        if (blocksOfForm.size() > 1 && areBlocksEqual) {
            return processEqualBlocks(text, blocksOfForm, documentQuestionValue);
        } else {
            return processNonEqualBlocks(text, documentQuestionValue);
        }
    }

    private String processEqualBlocks(String text, List<Block> blocksOfForm, DocumentQuestionValue documentQuestionValue) {
        StringBuilder textBuilder = new StringBuilder();
        String[] values = extractValues(documentQuestionValue);
        for (Block block : blocksOfForm) {
            String blockText = text;
            for (int i = 0; i < values.length; i += 3) {
                int blockId = Integer.parseInt(values[i]);
                String value = values[i + 2];
                if (blockId == block.getId()) {
                    blockText = blockText.replaceFirst("\\[value\\]", value);
                }
            }
            textBuilder.append(blockText).append(", ");
        }
        if (textBuilder.length() > 2) {
            textBuilder.setLength(textBuilder.length() - 2);
        }
        return textBuilder.toString();
    }

    private String processNonEqualBlocks(String text, DocumentQuestionValue documentQuestionValue) {
        String blockText = text;
        String[] values = extractValues(documentQuestionValue);

        for (int i = 0; i < values.length; i += 3) {
            String value = values[i + 2];
            blockText = blockText.replaceFirst("\\[value\\]", value);
        }
        return blockText;
    }

    private String[] extractValues(DocumentQuestionValue documentQuestionValue) {
        String concatenatedValues = documentQuestionValue.getValue();
        String formPrefix = "form/";
        String valueTypeWithoutForm = concatenatedValues.substring(formPrefix.length());
        return valueTypeWithoutForm.split("/");
    }

//    private Question findQuestionById(List<Question> questions, Integer questionId) {
//        for (Question question : questions) {
//            if (question.getId().equals(questionId)) {
//                return question;
//            }
//        }
//        return null;
//    }



    private boolean isExist(Long documentId, List<DocumentQuestionValue> documentQuestionValues) {
        return documentQuestionValues.stream().anyMatch(dqv -> dqv.getDocument().getId().equals(documentId));
    }


//    private String replaceValues(String text, Long questionId, List<DocumentQuestionValue> documentQuestionValues) {
//        for (DocumentQuestionValue documentQuestionValue : documentQuestionValues) {
//            if (documentQuestionValue.getQuestion().getId().equals(questionId)) {
//                if (documentQuestionValue.getValue() != null) {
//                    text = text.replace("[value]", documentQuestionValue.getValue());
//                } else {
//                    text = text.replace("[value]", "null");
//                }
//                break;
//            }
//
//        }
//        return text;
//    }

    public byte[] generatePdfFromHtml(String html, ByteArrayOutputStream outputStream) {
        try {
            String sanitizedHtml = html.replaceAll("&nbsp;", "\u00A0");
            String wellFormedXml = wrapHtmlContent(sanitizedHtml);
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(wellFormedXml);
            renderer.layout();
            renderer.createPDF(outputStream);
            renderer.finishPDF();

            return outputStream.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("Error generating PDF from XML: ", e);
            return new byte[0];
        }
    }

    private String wrapHtmlContent(String html) {
        if (!html.toLowerCase().contains("<html")) {
            html = "<!DOCTYPE html>\n" +
                    "<html>\n" +
                    "<head>\n" +
                    "    <meta charset=\"UTF-8\">\n" +
                    "    <title>Generated PDF</title>\n" +
                    "</head>\n" +
                    "<body>\n" +
                    html +
                    "</body>\n" +
                    "</html>";
        }

        return html;
    }

    @Transactional
    public ApiResponse addValues(AddValuesRequest request) {
        Long documentId = request.getDocumentId();
        List<DocumentQuestionValueDTO> values = request.getValues();
        boolean isDraft = request.isDraft();
        Documents document = documentsRepository.findById(documentId).orElse(null);
        if (document == null) {
            return new ApiResponse("Document not found.", null);
        }
        document.setDraft(isDraft);
        for (DocumentQuestionValueDTO valueDto : values) {
            if (!processQuestionValue(valueDto, document)) {
                return new ApiResponse("Failed to add some values.", null);
            }
        }
        return new ApiResponse("Values added successfully.", null);
    }

    private boolean processQuestionValue(DocumentQuestionValueDTO valueDto, Documents document) {
        Long questionId = valueDto.getQuestionId();
        Question currentQuestion = questionRepository.findById(questionId).orElse(null);

        if (currentQuestion == null) {
            return false;
        }
        switch (currentQuestion.getValueType()) {
            case "form":
                return processFormQuestionValue(currentQuestion, document, valueDto);
            case "filter":
                return processFilterQuestionValue(currentQuestion, document, valueDto);
            case "date":
                return processDateQuestionValue(currentQuestion, document, valueDto);
            case "time":
                return processTimeQuestionValue(currentQuestion, document, valueDto);
            default:
                String value = valueDto.getValue();
                value = currentQuestion.getValueType()+"/" +value;
                DocumentQuestionValue newValue = new DocumentQuestionValue(currentQuestion, document, value);
                documentQuestionValueRepository.save(newValue);
                return true;
        }
    }

    private boolean processTimeQuestionValue(Question currentQuestion, Documents document, DocumentQuestionValueDTO valueDto) {
        LocalTime firstTimeValue = valueDto.getFirstTimeValues();
        LocalTime secondTimeValue = valueDto.getSecondTimeValue();

        if (firstTimeValue == null || secondTimeValue == null) {
            return false;
        }
        DocumentQuestionValue newTimeValues = new DocumentQuestionValue(currentQuestion, document, firstTimeValue, secondTimeValue);
        documentQuestionValueRepository.save(newTimeValues);
        return true;
    }

    private boolean processDateQuestionValue(Question currentQuestion, Documents document, DocumentQuestionValueDTO valueDto) {
        String dateValue = valueDto.getDateValue().toString();

        if (dateValue == null) {
            return false;
        }
        dateValue= currentQuestion.getValueType() + "/" +  dateValue;
        DocumentQuestionValue newDateValue = new DocumentQuestionValue(currentQuestion, document,dateValue);
        documentQuestionValueRepository.save(newDateValue);
        return true;
    }

    private boolean processFilterQuestionValue(Question currentQuestion, Documents document, DocumentQuestionValueDTO valueDto) {
        Filter filter = filterService.getFilterByQuestionId(currentQuestion.getId());

        if (filter == null) {
            return false;
        }

        Object filterValue = switch (filter.getFilterType()) {
            case INTEGER -> valueDto.getIntFilterValue();
            case DOUBLE -> valueDto.getDoubleFilterValue();

        };

        if (filterValue != null) {
            DocumentQuestionValue newFilterValue = new DocumentQuestionValue(currentQuestion, document, filterValue);
            documentQuestionValueRepository.save(newFilterValue);
            return true;
        }

        return false;
    }

    public boolean processFormQuestionValue(Question question,Documents document, DocumentQuestionValueDTO valueDTO) {
        DocumentQuestionValue newValue = new DocumentQuestionValue(question,document,"");
        List<FormValues> formValues=valueDTO.getFormValues();
        if (formValues == null) {
            return false;
        }
        for (FormValues formValue : formValues) {
            String newValueString = formValue.getBlockId() + "/" + formValue.getLabelId() + "/" + formValue.getLabelValue();
            if (newValue.getValue().isEmpty()) {
                newValueString = "form/" + newValueString;
            } else {
                newValueString = "/" + newValueString;
            }
            newValue.setValue(newValue.getValue() + newValueString);
        }
        documentQuestionValueRepository.save(newValue);
        return true;
    }

    @Transactional
    public ApiResponse updateValues(Long documentQuestionValueId, DocumentQuestionValueDTO newValue) {
        Optional<DocumentQuestionValue> optionalExistingValue = documentQuestionValueRepository.findById(documentQuestionValueId);
        if (optionalExistingValue.isEmpty()) {
            return new ApiResponse("Value not found.", null);
        }
        DocumentQuestionValue existingDocumentQuestionValue = optionalExistingValue.get();
        Question currentQuestion = existingDocumentQuestionValue.getQuestion();

        switch (currentQuestion.getValueType()) {
            case "form":
                return updateFormValuesToQuestion(existingDocumentQuestionValue, newValue);
            case "filter":
                return updateFilterQuestionValue(existingDocumentQuestionValue, newValue);
            case "date":
                return updateDateQuestionValue(existingDocumentQuestionValue, newValue);
            case "time":
                return updateTimeQuestionValue(existingDocumentQuestionValue, newValue);
            default:
                String value = newValue.getValue();
                existingDocumentQuestionValue.setValue(value);
                documentQuestionValueRepository.save(existingDocumentQuestionValue);
                return new ApiResponse("Values updated successfully.", null);
        }
    }

    private ApiResponse updateTimeQuestionValue(DocumentQuestionValue existingValue, DocumentQuestionValueDTO newValue) {
        LocalTime firstTimeValue = newValue.getFirstTimeValues();
        LocalTime secondTimeValue = newValue.getSecondTimeValue();

        if (firstTimeValue == null || secondTimeValue == null) {
            return new ApiResponse("Time values are missing.", null);
        }

        existingValue.setFirstTimeValues(firstTimeValue);
        existingValue.setSecondTimeValue(secondTimeValue);
        documentQuestionValueRepository.save(existingValue);
        return new ApiResponse("Time values updated successfully.", null);
    }

    private ApiResponse updateDateQuestionValue(DocumentQuestionValue existingValue, DocumentQuestionValueDTO newValue) {
        LocalDate dateValue = newValue.getDateValue();

        if (dateValue == null) {
            return new ApiResponse("Date value is missing.", null);
        }

        existingValue.setDateValue(dateValue);
        documentQuestionValueRepository.save(existingValue);
        return new ApiResponse("Date value updated successfully.", null);
    }

    private ApiResponse updateFilterQuestionValue(DocumentQuestionValue existingValue, DocumentQuestionValueDTO newValue) {
        Filter filter = filterService.getFilterByQuestionId(existingValue.getQuestion().getId());
        if (filter == null) {
            return new ApiResponse("Filter not found.", null);
        }
        if (filter.getFilterType() == FilterType.INTEGER) {
            Integer intFilterValue = newValue.getIntFilterValue();
            if (intFilterValue == null) {
                return new ApiResponse("Integer filter value is missing.", null);
            }
            existingValue.setIntFilterValue(intFilterValue);
        } else {
            Double doubleFilterValue = newValue.getDoubleFilterValue();
            if (doubleFilterValue == null) {
                return new ApiResponse("Double filter value is missing.", null);
            }
            existingValue.setDoubleFilterValue(doubleFilterValue);
        }
        documentQuestionValueRepository.save(existingValue);
        return new ApiResponse("Filter values updated successfully.", null);
    }


    public ApiResponse updateFormValuesToQuestion(DocumentQuestionValue existingValue, DocumentQuestionValueDTO newValue) {
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

    public List<DocumentQuestionValue> getValuesByDocumentId(Long documentId) {
        Optional<Documents> documentOptional = documentsRepository.findById(documentId);
        if (documentOptional.isPresent()) {
            Documents document = documentOptional.get();
            return document.getDocumentQuestionValues();
        } else {
            throw new EntityNotFoundException("Document not found with ID: " + documentId);
        }
    }

    public void deleteDocument(Long documentId) {
        Optional<Documents> documentOptional = documentsRepository.findById(documentId);
        if (documentOptional.isPresent()) {
            Documents document = documentOptional.get();
            documentsRepository.delete(document);
        } else {
            throw new EntityNotFoundException("Document not found with ID: " + documentId);
        }
    }


}




