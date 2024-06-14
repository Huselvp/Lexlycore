package com.iker.Lexly.service.form;


import com.iker.Lexly.Entity.Form.Label;
import com.iker.Lexly.Entity.Form.Block;
import com.iker.Lexly.Entity.Form.LabelType;
import com.iker.Lexly.repository.form.LabelRepository;
import com.iker.Lexly.repository.form.BlockRepository;
import com.iker.Lexly.request.AddLabelOption;
import com.iker.Lexly.responses.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class LabelService {

    Logger logger = LoggerFactory.getLogger(LabelService.class);
    private final LabelRepository labelRepository;
    private final BlockRepository blockRepository;
    private AtomicLong optionKeyGenerator = new AtomicLong();

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
        Label savedLabel = labelRepository.save(label);
        logger.info("Created Label successfully :{}",savedLabel);
        return savedLabel;
    }
    @Transactional
    public List<Label> createManyLabels(Long blockId, List<Label> labels) {
        Block block = blockRepository.findById(blockId).orElseThrow(() -> new IllegalArgumentException("block not found with ID"+blockId));
        List<Label> savedLabels = new ArrayList<>();
        for (Label label : labels) {
        label.setBlock(block);
        savedLabels.add(labelRepository.save(label));

        }
        logger.info("Created Labels successfully :{}",savedLabels);
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

            Label savedLabel= labelRepository.save(label);
            logger.info("Updated Label successfully :{}",savedLabel);
            return new ApiResponse("Label updated successfully.",savedLabel);
        } else {

            return new ApiResponse("Label with ID " + label + " not found.", label);
        }
    }

    @Transactional
    public ApiResponse updateLabels(Long blockId, List<Label> labels) {
        List<ApiResponse> responses = new ArrayList<>();

        for (Label label : labels) {
            if (label.getType() == null) {
                responses.add(new ApiResponse("Label type is not specified.", null));
                continue;
            }
            Optional<Label> labelOptional = labelRepository.findById(label.getId());
            if (labelOptional.isPresent()) {
                Label existingLabel = labelOptional.get();
                // Check if the type has changed from SELECT to another type so, we can delete the existing options
                if (existingLabel.getType() == LabelType.SELECT && label.getType() != LabelType.SELECT) {
                    existingLabel.getOptions().clear();
                }
                label.setId(existingLabel.getId());
                label.setBlock(existingLabel.getBlock());
                Label savedLabel = labelRepository.save(label);
                logger.info("Updated Label successfully :{}", savedLabel);
                responses.add(new ApiResponse("Label updated successfully.",savedLabel));
            } else {
                responses.add(new ApiResponse("Label with ID " + label.getId() + " not found.", label));
            }
        }

        return new ApiResponse("Batch label update completed.",null);
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

        Map<Long, String> options = label.getOptions();

        options.put(request.getOptionKey(),request.getOptionValue());

        label.setOptions(options);

        return labelRepository.save(label);
    }

    public Label updateOption(Long labelId, Long optionKey, String newValue) {
        Label label = labelRepository.findById(labelId)
                .orElseThrow(() -> new IllegalArgumentException("Label not found with ID " + labelId));

        if (label.getOptions().containsKey(optionKey)) {
            label.getOptions().put(optionKey, newValue);
            return labelRepository.save(label);
        } else {
            throw new IllegalArgumentException("Option with key " + optionKey + " not found in label with ID " + labelId);
        }
    }


    public Label deleteOption(Long labelId, Long optionKey) {
        Label label = labelRepository.findById(labelId)
                .orElseThrow(() -> new IllegalArgumentException("Label not found with ID " + labelId));

        if (label.getOptions().containsKey(optionKey)) {
            label.getOptions().remove(optionKey);
            return labelRepository.save(label);
        } else {
            throw new IllegalArgumentException("Option with key " + optionKey + " not found in label with ID " + labelId);
        }
    }

    public Label deleteOptions(Long labelId, List<Long> optionKeys) {
        Label label = labelRepository.findById(labelId)
                .orElseThrow(() -> new IllegalArgumentException("Label not found with ID " + labelId));
        Map<Long, String> options = label.getOptions();
        for (Long optionKey : optionKeys) {
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
    public Map<Long, String> getAllOptionsByLabelId(Long labelId) {
        Label label = labelRepository.findById(labelId)
                .orElseThrow(() -> new IllegalArgumentException("Label not found with ID " + labelId));
        return label.getOptions();
    }

    @Transactional(readOnly = true)
    public String getOptionByKey (Long labelId, Long optionKey) {
        Label label = labelRepository.findById(labelId)
                .orElseThrow(() -> new IllegalArgumentException("Label not found with ID " + labelId));
        return label.getOptions().get(optionKey);
    }

    @Transactional
    public Label addOptions(Long labelId, List<String> optionsToAdd) {
        Label label = labelRepository.findById(labelId)
                .orElseThrow(() -> new IllegalArgumentException("Label not found with ID " + labelId));

        Map<Long, String> existingOptions = label.getOptions();
        long currentMaxKey = existingOptions.keySet().stream().mapToLong(v -> v).max().orElse(0);
        // Initialize the key generator based on the current maximum key
        AtomicLong optionKeyGenerator = new AtomicLong(currentMaxKey);

        for (String optionValue : optionsToAdd) {
            long newKey = optionKeyGenerator.incrementAndGet();
            existingOptions.put(newKey, optionValue);
        }

        label.setOptions(existingOptions);
        return labelRepository.save(label);
    }
//    @Transactional
//    public Label addOptions(Long labelId, Map<Long, String> optionsToAdd) {
//        Label label = labelRepository.findById(labelId)
//                .orElseThrow(() -> new IllegalArgumentException("Label not found with ID " + labelId));
//
//        Map<Long, String> existingOptions = label.getOptions();
//        existingOptions.putAll(optionsToAdd);
//
//        label.setOptions(existingOptions);
//
//        return labelRepository.save(label);
//    }


}
