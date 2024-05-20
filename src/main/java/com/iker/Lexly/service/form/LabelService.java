package com.iker.Lexly.service.form;


import com.iker.Lexly.Entity.Form.Label;
import com.iker.Lexly.Entity.Form.Block;
import com.iker.Lexly.repository.form.LabelRepository;
import com.iker.Lexly.repository.form.BlockRepository;
import com.iker.Lexly.request.AddLabelOption;
import com.iker.Lexly.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class LabelService {

    private final LabelRepository labelRepository;
    private final BlockRepository blockRepository;

    @Autowired
    public LabelService(LabelRepository labelRepository, BlockRepository blockRepository) {
        this.labelRepository = labelRepository;
        this.blockRepository = blockRepository;
    }

    @Transactional(readOnly = true)
    public List<Label> getAllLabelsByBlockId(Long blockId) {
        return labelRepository.findByBlockId(blockId);
    }

    @Transactional
    public Label createLabel(Long blockId, Label label) {
        Block block = blockRepository.findById(blockId).orElseThrow(() -> new IllegalArgumentException("block not found with ID"+blockId));

        label.setBlock(block);
        return labelRepository.save(label);
    }
    @Transactional
    public List<Label> createManyLabels(Long blockId, List<Label> labels) {
        Block block = blockRepository.findById(blockId).orElseThrow(() -> new IllegalArgumentException("block not found with ID"+blockId));
        List<Label> savedLabels = new ArrayList<>();
        for (Label label : labels) {
        label.setBlock(block);
        savedLabels.add(labelRepository.save(label));

        }
        return savedLabels;
    }

    @Transactional(readOnly = true)
    public Label getLabelById(Long labelId) {
        return labelRepository.findById(labelId)
                .orElseThrow(() -> new IllegalArgumentException("Label not found"));
    }

    @Transactional
    public ApiResponse updateLabel(Long blockId, Long labelId, Label label) {
        if (label.getType() == null) {
            return new ApiResponse("Label type is not specified.", null);
        }
        Optional<Label> labelOptional = labelRepository.findById(labelId);
        if (labelOptional.isPresent()) {
            Label existingLabel = labelOptional.get();

            label.setId(existingLabel.getId());
            label.setBlock(existingLabel.getBlock());

            labelRepository.save(label);
            return new ApiResponse("Label updated successfully.", label);
        } else {
            return new ApiResponse("Label with ID " + label + " not found.", label);
        }
    }

    @Transactional
    public void deleteLabel(Long labelId) {
        Label label= labelRepository.findById(labelId).orElse(null);
        if (label !=null) {

            label.getOptions().clear();

            labelRepository.deleteById(labelId);
        } else {
            throw new IllegalArgumentException("Label not found");
        }
    }
    @Transactional
    public Label addOption(Long labelId, AddLabelOption request) {
        Label label = labelRepository.findById(labelId)
                .orElseThrow(() -> new IllegalArgumentException("Label not found with ID " + labelId));

        Map<String, String> options = label.getOptions();

        options.put(request.getOptionKey(),request.getOptionValue());

        label.setOptions(options);

        return labelRepository.save(label);
    }

    public Label updateOption(Long labelId, String optionKey, String newValue) {
        Label label = labelRepository.findById(labelId)
                .orElseThrow(() -> new IllegalArgumentException("Label not found with ID " + labelId));

        if (label.getOptions().containsKey(optionKey)) {
            label.getOptions().put(optionKey, newValue);
            return labelRepository.save(label);
        } else {
            throw new IllegalArgumentException("Option with key " + optionKey + " not found in label with ID " + labelId);
        }
    }


    public Label deleteOption(Long labelId, String optionKey) {
        Label label = labelRepository.findById(labelId)
                .orElseThrow(() -> new IllegalArgumentException("Label not found with ID " + labelId));

        if (label.getOptions().containsKey(optionKey)) {
            label.getOptions().remove(optionKey);
            return labelRepository.save(label);
        } else {
            throw new IllegalArgumentException("Option with key " + optionKey + " not found in label with ID " + labelId);
        }
    }

    public Label deleteOptions(Long labelId, List<String> optionKeys) {
        Label label = labelRepository.findById(labelId)
                .orElseThrow(() -> new IllegalArgumentException("Label not found with ID " + labelId));
        Map<String, String> options = label.getOptions();
        for (String optionKey : optionKeys) {
            if (options.containsKey(optionKey)) {
                options.remove(optionKey);
            } else {
                throw new IllegalArgumentException("Option with key " + optionKey + " not found in label with ID " + labelId);
            }
        }
        label.setOptions(options);
        return labelRepository.save(label);
    }

    @Transactional(readOnly = true)
    public Map<String, String> getAllOptionsByLabelId(Long labelId) {
        Label label = labelRepository.findById(labelId)
                .orElseThrow(() -> new IllegalArgumentException("Label not found with ID " + labelId));
        return label.getOptions();
    }

    @Transactional(readOnly = true)
    public String getOptionByKey (Long labelId, String optionKey) {
        Label label = labelRepository.findById(labelId)
                .orElseThrow(() -> new IllegalArgumentException("Label not found with ID " + labelId));
        return label.getOptions().get(optionKey);
    }

    @Transactional
    public Label addOptions(Long labelId, Map<String, String> optionsToAdd) {
        Label label = labelRepository.findById(labelId)
                .orElseThrow(() -> new IllegalArgumentException("Label not found with ID " + labelId));

        Map<String, String> existingOptions = label.getOptions();
        existingOptions.putAll(optionsToAdd);

        label.setOptions(existingOptions);

        return labelRepository.save(label);
    }


}
