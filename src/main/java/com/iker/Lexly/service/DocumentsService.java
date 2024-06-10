package com.iker.Lexly.service;
import com.iker.Lexly.Entity.*;
import com.iker.Lexly.Entity.Form.Block;
import com.iker.Lexly.Entity.Form.Form;
import com.iker.Lexly.config.jwt.JwtService;
import com.iker.Lexly.repository.*;
import com.iker.Lexly.repository.form.BlockRepository;
import com.iker.Lexly.repository.form.FormRepository;
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
import java.time.LocalDateTime;
import java.util.*;


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
    private final QuestionService questionService;

    @Autowired
    public DocumentsService(DocumentQuestionValueRepository documentQuestionValueRepository, QuestionRepository questionRepository, TemplateRepository templateRepository, UserRepository userRepository, DocumentsRepository documentsRepository, JwtService jwtService, BlockRepository blockRepository, BlockService blockService , FormRepository formRepository, FilterService filterService, QuestionService questionService) {
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
        this.questionService = questionService;
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
//
//    public String replaceValues(String text, Long questionId, List<DocumentQuestionValue> documentQuestionValues) {
//        for (DocumentQuestionValue documentQuestionValue : documentQuestionValues) {
//            if (documentQuestionValue.getValue() == null) {
//                text = text.replace("[value]", "null");
//            } else if (documentQuestionValue.getQuestion().getId().equals(questionId)) {
//                text = processDocumentQuestionValue(text, questionId, documentQuestionValue);
//            }
//        }
//        return text;
//    }
//
//    private String processDocumentQuestionValue(String text, Long questionId, DocumentQuestionValue documentQuestionValue) {
//        if ("form".equals(documentQuestionValue.getQuestion().getValueType())) {
//            return processFormValue(text, questionId, documentQuestionValue);
//        } else {
//            return text.replace("[value]", documentQuestionValue.getValue());
//        }
//    }
//
//    private String processFormValue(String text, Long questionId, DocumentQuestionValue documentQuestionValue) {
//        Optional<Form> formOptional = formRepository.findByQuestionId(questionId);
//        if (!formOptional.isPresent()) {
//            return text;
//        }
//        Form form = formOptional.get();
//        List<Block> blocksOfForm = blockRepository.findByFormId(form.getId());
//        boolean areBlocksEqual = blockService.areBlocksEqual(form.getId());
//
//        if (blocksOfForm.size() > 1 && areBlocksEqual) {
//            return processEqualBlocks(text, blocksOfForm, documentQuestionValue);
//        } else {
//            return processNonEqualBlocks(text, documentQuestionValue);
//        }
//    }
//
//    private String processEqualBlocks(String text, List<Block> blocksOfForm, DocumentQuestionValue documentQuestionValue) {
//        StringBuilder textBuilder = new StringBuilder();
//        String[] values = extractValues(documentQuestionValue);
//        for (Block block : blocksOfForm) {
//            String blockText = text;
//            for (int i = 0; i < values.length; i += 3) {
//                int blockId = Integer.parseInt(values[i]);
//                String value = values[i + 2];
//                if (blockId == block.getId()) {
//                    blockText = blockText.replaceFirst("\\[value\\]", value);
//                }
//            }
//            textBuilder.append(blockText).append(", ");
//        }
//        if (textBuilder.length() > 2) {
//            textBuilder.setLength(textBuilder.length() - 2);
//        }
//        return textBuilder.toString();
//    }
//
//    private String processNonEqualBlocks(String text, DocumentQuestionValue documentQuestionValue) {
//        String blockText = text;
//        String[] values = extractValues(documentQuestionValue);
//
//        for (int i = 0; i < values.length; i += 3) {
//            String value = values[i + 2];
//            blockText = blockText.replaceFirst("\\[value\\]", value);
//        }
//        return blockText;
//    }
//
//    private String[] extractValues(DocumentQuestionValue documentQuestionValue) {
//
//        String concatenatedValues = documentQuestionValue.getValue();
//        String formPrefix = "form/";
//        String valueTypeWithoutForm = concatenatedValues.substring(formPrefix.length());
//        return valueTypeWithoutForm.split("/");
//    }
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
        }

        else {
            String value = extractValues(documentQuestionValue);
            return text.replaceFirst("[value]", value);
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
        String[] values = extractValues(documentQuestionValue).split("/");;
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
        String[] values = extractValues(documentQuestionValue).split("/");;

        for (int i = 0; i < values.length; i += 3) {
            String value = values[i + 2];
            blockText = blockText.replaceFirst("\\[value\\]", value);
        }
        return blockText;
    }

    private String extractValues(DocumentQuestionValue documentQuestionValue) {
        String valueWithType = documentQuestionValue.getValue();
        Question currentQuestion = documentQuestionValue.getQuestion();
        String type = currentQuestion.getValueType() + "/";
        if (currentQuestion.getValueType().startsWith("checkbox")) {
            type ="checkbox/";
        }
        return valueWithType.replaceFirst(type, "");
    }

//    private Question findQuestionById(List<Question> questions, Integer questionId) {
//        for (Question question : questions) {
//            if (question.getId().equals(questionId)) {
//                return question;
//            }
//        }
//        return null;
//    }

//
//    public String replaceValues(String text, Long questionId, List<DocumentQuestionValue> documentQuestionValues) {
//        for (DocumentQuestionValue documentQuestionValue : documentQuestionValues) {
//            if (documentQuestionValue.getValue() == null) {
//                text = text.replace("[value]", "null");
//            } else if (documentQuestionValue.getQuestion().getId().equals(questionId)) {
//                text = processDocumentQuestionValue(text, questionId, documentQuestionValue);
//            }
//        }
//        return text;
//    }
//
//    private String processDocumentQuestionValue(String text, Long questionId, DocumentQuestionValue documentQuestionValue) {
//        String [] value = extractValues(documentQuestionValue, questionId);
//        if ("form".equals(documentQuestionValue.getQuestion().getValueType())) {
//            return processFormValue(text, questionId, value);
//        } else {
//            return processDefaultValue(text, value);
//        }
//    }
//
//    private String processFormValue(String text, Long questionId,String [] value) {
//        Optional<Form> formOptional = formRepository.findByQuestionId(questionId);
//        if (!formOptional.isPresent()) {
//            return text;
//        }
//        Form form = formOptional.get();
//        List<Block> blocksOfForm = blockRepository.findByFormId(form.getId());
//        boolean areBlocksEqual = blockService.areBlocksEqual(form.getId());
//
//        if (blocksOfForm.size() > 1 && areBlocksEqual) {
//            return processEqualBlocks(text, blocksOfForm,value);
//        } else {
//            return processNonEqualBlocks(text, value);
//        }
//    }
//
//    private String processEqualBlocks(String text, List<Block> blocksOfForm, String [] value) {
//        StringBuilder textBuilder = new StringBuilder();
////        String[] values = extractValues(documentQuestionValue);
//        String[] values =value ;
//        for (Block block : blocksOfForm) {
//            String blockText = text;
//            for (int i = 0; i < values.length; i += 3) {
//                int blockId = Integer.parseInt(values[i]);
//                String extractedValue = values[i + 2];
//                if (blockId == block.getId()) {
//                    blockText = blockText.replaceFirst("\\[value\\]", extractedValue);
//                }
//            }
//            textBuilder.append(blockText).append(", ");
//        }
//        if (textBuilder.length() > 2) {
//            textBuilder.setLength(textBuilder.length() - 2);
//        }
//        return textBuilder.toString();
//    }
//
//    private String processNonEqualBlocks(String text, String [] value) {
//        String blockText = text;
////        String[] values = extractValues(documentQuestionValue);
//
//        String[] values =value;
//        for (int i = 0; i < values.length; i += 3) {
//            String extractedValue = values[i + 2];
//            blockText = blockText.replaceFirst("\\[value\\]", extractedValue);
//        }
//        return blockText;
//    }
//    private String processDefaultValue(String text, String [] value) {
//        String blockText = text;
//        String[] values =value;
//        for (int i = 0; i < values.length; i ++) {
//            blockText = blockText.replaceFirst("\\[value\\]",values[i]);
//        }
//        return blockText;
//    }
//
//    private String[] extractValues(DocumentQuestionValue documentQuestionValue , Long questionId) {
//        Question question = questionRepository.findById(questionId).orElseThrow();
//        String concatenatedValues = documentQuestionValue.getValue();
//        String formPrefix = question.getValueType().split("/")[0] +"/";
//        String valueTypeWithoutForm = concatenatedValues.substring(formPrefix.length());
//        return valueTypeWithoutForm.split("/");
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




