package com.iker.Lexly.Controller;
import com.iker.Lexly.DTO.DocumentQuestionValueDTO;
import com.iker.Lexly.Entity.Form.Block;
import com.iker.Lexly.Entity.Form.Form;
import com.iker.Lexly.Entity.Form.Label;
import com.iker.Lexly.repository.form.FormRepository;
import com.iker.Lexly.request.AddValuesRequest;
import com.iker.Lexly.request.FormValues;
import com.iker.Lexly.request.UserInputs;
import com.iker.Lexly.request.UserInputsSubQuestion;
import com.iker.Lexly.responses.ApiResponse;
import com.iker.Lexly.service.DocumentQuestionValueService;
import com.iker.Lexly.service.DocumentSubQuestionValueService;
import com.iker.Lexly.service.DocumentsService;
import com.iker.Lexly.service.QuestionService;
import com.iker.Lexly.service.form.BlockService;
import com.iker.Lexly.service.form.FormService;
import com.iker.Lexly.service.form.LabelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
@RestController
@RequestMapping("/api/form")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class FormController {
    @Autowired
    FormService formService;
    @Autowired
    FormRepository formRepository;
    @Autowired
    BlockService blockService;
    @Autowired
    LabelService labelService;
    @Autowired
    QuestionService questionService;
    @Autowired
    private DocumentsService documentsService;
    @Autowired
    private DocumentQuestionValueService documentQuestionValueService;
    @Autowired
    private DocumentSubQuestionValueService documentSubQuestionValueService;




    @GetMapping("/all_forms")
    public List<Form> getAllForms() {

        return formService.getAllForms();
    }

    @GetMapping("get/{questionId}")
    public ResponseEntity<?> getFormIdByQuestionId(@PathVariable Long questionId) {
        try {
            Long formId = formService.getFormsByQuestionId(questionId);
            return ResponseEntity.ok(formId);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @GetMapping("/{idForm}")
    public ResponseEntity<Form> getFormById(@PathVariable Long idForm) {
        Form form = formService.getFormById(idForm);
        if (form != null) {
            return ResponseEntity.ok(form);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/create/{questionId}")
    public ResponseEntity<Form> createForm(@PathVariable Long questionId, @RequestBody Form form) {
        try {
            Form createdForm = formService.createForm(questionId, form);
            return new ResponseEntity<>(createdForm, HttpStatus.CREATED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>( HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/create-sub/{subQuestionId}")
    public ResponseEntity<Form> createSubquestionForm(@PathVariable Long subQuestionId, @RequestBody Form form) {
        try {
            Form createdForm = formService.createSubQuestionForm(subQuestionId, form);
            return new ResponseEntity<>(createdForm, HttpStatus.CREATED);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>( HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/update/{formId}")
    public ResponseEntity<Form> updateForm(
            @PathVariable Long formId,
            @RequestBody Form updateRequest
    ) {
        Form updatedForm = formService.updateForm(formId, updateRequest);
        if (updatedForm != null) {
            return new ResponseEntity<>(updatedForm, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/delete/{idForm}")
    public ResponseEntity<String> deleteForm(@PathVariable Long idForm) {
        Optional<Form> optionalForm = formRepository.findById(idForm);
        if (optionalForm.isPresent()) {
            formService.deleteForm(idForm);
            return ResponseEntity.ok("Form with ID " + idForm + " has been deleted successfully. DTO: " + optionalForm.get());
        } else {
            return ResponseEntity.status(404).body("Form not found with ID: " + idForm);
        }
    }
//    @PostMapping("/duplicate_form/{formId}")
//    public ResponseEntity<Form> duplicateForm(@PathVariable Long formId) {
//        Form duplicatedForm = formService.duplicateForm(formId);
//        return ResponseEntity.ok().body(duplicatedForm);
//    }
    @PostMapping("/block/duplicate/{formId}/{blockId}")
    public ResponseEntity<Block> duplicateBlock(@PathVariable Long formId, @PathVariable Long blockId) {
        Block duplicatedBlock = blockService.duplicateBlock(formId, blockId);
        return ResponseEntity.ok().body(duplicatedBlock);
    }

    @GetMapping("/blocks/{idForm}")
    public ResponseEntity<List<Block>> getAllBlocksByFormId(@PathVariable Long idForm) {
        List<Block> blocks = blockService.getAllBlocksByFormId(idForm);
        return ResponseEntity.ok(blocks);
    }

    @GetMapping("/block/{idForm}/{idBlock}")
    public ResponseEntity<Block> getBlockById(@PathVariable Long idForm,@PathVariable Long idBlock) {
        Block block = blockService.getBlockById(idBlock);
        if (block != null) {
            return ResponseEntity.ok(block);
        } else {
            return ResponseEntity.notFound().build();
        }
    }



    @PostMapping("/block/{idForm}")
    public ResponseEntity<Object> createBlock(@PathVariable Long idForm,@RequestBody Block block) {
        try {
            Block newBlock = blockService.createBlock(idForm);
            return ResponseEntity.status(HttpStatus.CREATED).body(newBlock);
        }catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @PostMapping("/blocks/{idForm}")
    public ResponseEntity<Object> createManyBlock(@PathVariable Long idForm,@RequestBody List<Block> blocks) {
        try {

            List<Block> listBlocks =blockService.createManyBlocks(idForm, blocks);
            return ResponseEntity.status(HttpStatus.CREATED).body(listBlocks);
        }catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }



    @PutMapping("/block/{idForm}/{idBlock}")
    public ResponseEntity<Block> updateBlock(
            @PathVariable Long idForm,
            @PathVariable Long idBlock,
            @RequestBody Block updateRequest
    ) {
        Block updatedBlock = blockService.updateBlock(idForm,idBlock,updateRequest);
        if (updatedBlock != null) {
            return ResponseEntity.ok(updatedBlock);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/block/{idForm}/{idBlock}")
    public ResponseEntity<String> deleteBlock(@PathVariable Long idForm ,@PathVariable Long idBlock) {
        try {
            blockService.deleteBlock(idBlock);
            return ResponseEntity.ok("Block with ID " + idBlock + " has been deleted successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/blocks/equal/{formId}")
    public ResponseEntity<String> areBlocksEqual(@PathVariable Long formId) {
        boolean blocksEqual = blockService.areBlocksEqual(formId);
        if (blocksEqual) {
            return ResponseEntity.ok("Blocks are equal");
        } else {
            return ResponseEntity.ok("Blocks are not equal");
        }
    }
    @PutMapping("/blocks/reorder")
    public ResponseEntity<String> reorderBlocks( @RequestBody List<Long> blocksIds) {
        try{
            blockService.reorderBlocks(blocksIds);
            return new ResponseEntity<>("Blocks reordered successfully.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error reordering blocks.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PutMapping("/blocks/labels/reorder")
    public ResponseEntity<String> reorderLabels( @RequestBody List<Long> labelsIds) {
        try{
            labelService.reorderLabels(labelsIds);
            return new ResponseEntity<>("labels reordered successfully.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error reordering labels.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/block/label/{idBlock}")
    public ResponseEntity<List<Label>> getAllLabelsByBlockId(@PathVariable Long idBlock) {
        List<Label> labels = labelService.getAllLabelsByBlockId(idBlock);
        return ResponseEntity.ok(labels);
    }

    @GetMapping("/block/label/{idBlock}/{idLabel}")
    public ResponseEntity<Label> getLabelById(@PathVariable Long idBlock,@PathVariable Long idLabel) {
        Label label = labelService.getLabelById(idLabel);
        if (label != null) {
            return ResponseEntity.ok(label);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/block/label/{idBlock}")
    public ResponseEntity<Label> createLabel(@PathVariable Long idBlock, @RequestBody Label label) {
        try {
            Label newLabel = labelService.createLabel(idBlock, label);
            return ResponseEntity.status(HttpStatus.CREATED).body(newLabel);
        }catch(IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/block/labels/{idBlock}")
    public ResponseEntity <List<Label>>createManyLabels(@PathVariable Long idBlock, @RequestBody List<Label> labels) {
        try {
            List<Label> newLabels = labelService.createManyLabels(idBlock, labels);
            return ResponseEntity.status(HttpStatus.CREATED).body(newLabels);
        }catch(IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/block/label/{idBlock}/{idLabel}")
    public ResponseEntity<ApiResponse> updateLabel(
            @PathVariable Long idBlock,
            @PathVariable Long idLabel,
            @RequestBody Label updateRequest
    ) {
        ApiResponse updatedLabel = labelService.updateLabel(idBlock, idLabel, updateRequest);
        if (updatedLabel .isSuccess()) {
            return ResponseEntity.ok(updatedLabel);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(updatedLabel);
        }
    }

    @PutMapping("/block/labels/{idBlock}")
    public ApiResponse updateLabels(@PathVariable Long idBlock, @RequestBody List<Label> labels) {
        return labelService.updateLabels(idBlock, labels);
    }

    @DeleteMapping("/block/label/{idBlock}/{idLabel}")
    public ResponseEntity<String> deleteLabel(@PathVariable Long idBlock ,@PathVariable Long idLabel) {
        try {
            labelService.deleteLabel(idLabel);
            return ResponseEntity.ok("Label with ID " + idLabel + " has been deleted successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("block/label/options/{labelId}")
    public ResponseEntity<?> getAllOptionsByLabelId(@PathVariable Long labelId) {
        try {
            Map<Long, String> options = labelService.getAllOptionsByLabelId(labelId);
            return ResponseEntity.ok(options);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error occurred");
        }
    }

    @GetMapping("block/label/option/{labelId}/{optionKey}")
    public ResponseEntity<?> getOptionByKey(@PathVariable Long labelId, @PathVariable Long optionKey) {
        try {
            String optionValue = labelService.getOptionByKey(labelId, optionKey);
            return ResponseEntity.ok(optionValue);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error occurred");
        }
    }

//    @PostMapping("/block/label/option/{labelId}")
//    public ResponseEntity<?> addOption(@PathVariable Long labelId,
//                                       @RequestBody AddLabelOption request) {
//        try {
//            Label label = labelService.addOption(labelId, request);
//            return new ResponseEntity<>(label, HttpStatus.CREATED);
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error occurred");
//        }
//    }

    @PatchMapping("/block/label/option/{labelId}/{optionKey}")
    public ResponseEntity<Label> updateOption(@PathVariable Long labelId, @PathVariable Long optionKey, @RequestParam String newValue) {
        Label updatedLabel = labelService.updateOption(labelId, optionKey, newValue);
        return ResponseEntity.ok().body(updatedLabel);
    }
    @PutMapping("/block/label/options/{labelId}")
    public ResponseEntity<Label> updateLabelOptions(
            @PathVariable Long labelId,
            @RequestBody List<Map<Long, String>> optionsToUpdate
    ) {
        try {
            Label updatedLabel = labelService.updateOptions(labelId, optionsToUpdate);
            return ResponseEntity.ok(updatedLabel);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }


    @DeleteMapping("/block/label/option/{labelId}/{optionKey}")
    public ResponseEntity<Label> deleteOption(@PathVariable Long labelId, @PathVariable Long optionKey) {
        Label updatedLabel = labelService.deleteOption(labelId, optionKey);
        return ResponseEntity.ok().body(updatedLabel);
    }
    @DeleteMapping("/block/label/options/{labelId}")
    public ResponseEntity<?> deleteOptions(@PathVariable Long labelId, @RequestBody List<Long> optionKeys) {
        try {
            Label deletedLabel = labelService.deleteOptions(labelId, optionKeys);
            return ResponseEntity.ok(deletedLabel);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PostMapping("/block/label/options/{labelId}")
    public ResponseEntity<Object> addOptions(@PathVariable Long labelId, @RequestBody List<String> optionsToAdd) {
        try {
            Label label = labelService.addOptions(labelId, optionsToAdd);
            return new ResponseEntity<>(label, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error occurred");
        }
    }

//    @PostMapping("/add-form-values/{questionId}/{documentId}")
//    public ResponseEntity<Void> addFormValuesToQuestion(
//            @PathVariable Long questionId,
//            @PathVariable Long documentId,
//            @RequestBody List<FormValues> formValues) {
//        return documentsService.addFormValuesToQuestion(questionId, documentId, formValues);
//    }
//    @PutMapping("/{questionId}/{documentId}")
//    public ResponseEntity<Void> updateFormValues(@PathVariable Long questionId,
//                                                 @PathVariable Long documentId,
//                                                 @RequestBody List<FormValues> formValues) {
//        return documentsService.updateFormValuesToQuestion(questionId, documentId, formValues);
//    }
    @PostMapping("/add")
    public ApiResponse addValues(@RequestBody AddValuesRequest request) {

        return documentQuestionValueService.addValues(request);
    }
    @PutMapping("/up/{valueId}")
    public ApiResponse updateValues(@PathVariable Long valueId ,@RequestBody UserInputs request) {
        return documentQuestionValueService.updateValues(valueId ,request);
    }
    @PutMapping("/up-sub/{valueId}")
    public ApiResponse updateSubQuestionValues(@PathVariable Long valueId ,@RequestBody UserInputsSubQuestion request) {
        return documentSubQuestionValueService.updateSubQuestionValues(valueId ,request);
    }

//    @PostMapping("/test/replaceValues/{questionId}/{DocumentQuestionValue}")
//    public String testReplaceValues(
//            @PathVariable Long questionId,
//            @PathVariable Long DocumentQuestionValue,
//            @RequestBody String text) {
//        return documentsService.replaceValues(text, questionId, DocumentQuestionValue);
//    }
//    @GetMapping("/processDocument")
//    public String processDocument(
//            @RequestParam Long questions,
//            @RequestParam Long documentId,
//            @RequestParam Long templateId,
//            @RequestParam Long documentQuestionValues) {
//        return documentsService.documentProcess(questions, documentId, templateId, documentQuestionValues);
//    }

    @GetMapping("/duration")
    public ResponseEntity<Long> calculateDuration(@RequestParam Long startDay, @RequestParam Long endDay) {
        try {
            long duration = questionService.calculateDuration(startDay, endDay);
            return new ResponseEntity<>(duration, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
