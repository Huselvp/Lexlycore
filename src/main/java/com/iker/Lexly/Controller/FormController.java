package com.iker.Lexly.Controller;
import com.iker.Lexly.Entity.Form.Block;
import com.iker.Lexly.Entity.Form.Form;
import com.iker.Lexly.Entity.Form.Label;
import com.iker.Lexly.repository.form.FormRepository;
import com.iker.Lexly.request.AddValuesRequest;
import com.iker.Lexly.request.FormValues;
import com.iker.Lexly.responses.ApiResponse;
import com.iker.Lexly.service.DocumentsService;
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
import java.util.Optional;
@RestController
@RequestMapping("/api")
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
    private DocumentsService documentsService;




    @GetMapping("/all_forms")
    public List<Form> getAllForms() {

        return formService.getAllForms();
    }
    @GetMapping("form/{idForm}")
    public ResponseEntity<Form> getFormById(@PathVariable Long idForm) {
        Form form = formService.getFormById(idForm);
        if (form != null) {
            return ResponseEntity.ok(form);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping(value = "/create_form")
    public ResponseEntity<Form> createForm( @RequestBody Form form) {
        Form newForm= formService.createForm(form);
        return ResponseEntity.ok(newForm);
    }
    @PutMapping("/update_form/{formId}")
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

    @DeleteMapping("delete_form/{idForm}")
    public ResponseEntity<String> deleteForm(@PathVariable Long idForm) {
        Optional<Form> optionalForm = formRepository.findById(idForm);
        if (optionalForm.isPresent()) {
            Form form = optionalForm.get();
            formService.deleteForm(idForm);
            return ResponseEntity.ok("Form with ID " + idForm + " has been deleted successfully. DTO: " + form);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PostMapping("/duplicate_form/{formId}")
    public ResponseEntity<Form> duplicateForm(@PathVariable Long formId) {
        Form duplicatedForm = formService.duplicateForm(formId);
        return ResponseEntity.ok().body(duplicatedForm);
    }
    @PostMapping("form/block/duplicate/{formId}/{blockId}")
    public ResponseEntity<Block> duplicateBlock(@PathVariable Long formId, @PathVariable Long blockId) {
        Block duplicatedBlock = blockService.duplicateBlock(formId, blockId);
        return ResponseEntity.ok().body(duplicatedBlock);
    }

    @GetMapping("form/blocks/{idForm}")
    public ResponseEntity<List<Block>> getAllBlocksByFormId(@PathVariable Long idForm) {
        List<Block> blocks = blockService.getAllBlocksByFormId(idForm);
        return ResponseEntity.ok(blocks);
    }

    @GetMapping("form/block/{idForm}/{idBlock}")
    public ResponseEntity<Block> getBlockById(@PathVariable Long idForm,@PathVariable Long idBlock) {
        Block block = blockService.getBlockById(idBlock);
        if (block != null) {
            return ResponseEntity.ok(block);
        } else {
            return ResponseEntity.notFound().build();
        }
    }



    @PostMapping("form/block/{idForm}")
    public ResponseEntity<Object> createBlock(@PathVariable Long idForm,@RequestBody Block block) {
        try {
            Block newBlock = blockService.createBlock(idForm, block);
            return ResponseEntity.status(HttpStatus.CREATED).body(newBlock);
        }catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @PostMapping("form/blocks/{idForm}")
    public ResponseEntity<Object> createManyBlock(@PathVariable Long idForm,@RequestBody List<Block> blocks) {
        try {

            List<Block> listBlocks =blockService.createManyBlocks(idForm, blocks);
            return ResponseEntity.status(HttpStatus.CREATED).body(listBlocks);
        }catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }



    @PutMapping("form/block/{idForm}/{idBlock}")
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

    @DeleteMapping("form/block/{idForm}/{idBlock}")
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
            Map<String, String> options = labelService.getAllOptionsByLabelId(labelId);
            return ResponseEntity.ok(options);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error occurred");
        }
    }

    @GetMapping("block/label/option/{labelId}/{optionKey}")
    public ResponseEntity<?> getOptionByKey(@PathVariable Long labelId, @PathVariable String optionKey) {
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

    @PatchMapping("/block/label/options/{labelId}/{optionKey}")
    public ResponseEntity<Label> updateOption(@PathVariable Long labelId, @PathVariable String optionKey, @RequestParam String newValue) {
        Label updatedLabel = labelService.updateOption(labelId, optionKey, newValue);
        return ResponseEntity.ok().body(updatedLabel);
    }

    @DeleteMapping("/block/label/option/{labelId}/{optionKey}")
    public ResponseEntity<Label> deleteOption(@PathVariable Long labelId, @PathVariable String optionKey) {
        Label updatedLabel = labelService.deleteOption(labelId, optionKey);
        return ResponseEntity.ok().body(updatedLabel);
    }
    @DeleteMapping("/block/label/options/{labelId}")
    public ResponseEntity<?> deleteOptions(@PathVariable Long labelId, @RequestBody List<String> optionKeys) {
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
    public ResponseEntity<?> addOptions(@PathVariable Long labelId, @RequestBody Map<String, String> optionsToAdd) {
        try {
            Label label = labelService.addOptions(labelId, optionsToAdd);
            return new ResponseEntity<>(label, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error occurred");
        }
    }

    @PostMapping("/add-form-values/{questionId}/{documentId}")
    public ResponseEntity<Void> addFormValuesToQuestion(
            @PathVariable Long questionId,
            @PathVariable Long documentId,
            @RequestBody List<FormValues> formValues) {
        return documentsService.addFormValuesToQuestion(questionId, documentId, formValues);
    }
    @PutMapping("/{questionId}/{documentId}")
    public ResponseEntity<Void> updateFormValues(@PathVariable Long questionId,
                                                 @PathVariable Long documentId,
                                                 @RequestBody List<FormValues> formValues) {
        return documentsService.updateFormValuesToQuestion(questionId, documentId, formValues);
    }
    @PostMapping("/add")
    public ApiResponse addValues(@RequestBody AddValuesRequest request) {

        return documentsService.addValues(request);
    }
    @PutMapping("/up")
    public ApiResponse updateValues(@RequestBody AddValuesRequest request) {
        return documentsService.updateValues(request);
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
}
