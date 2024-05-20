package com.iker.Lexly.service.form;


import com.iker.Lexly.Entity.Form.Block;
import com.iker.Lexly.Entity.Form.Form;
import com.iker.Lexly.Entity.Form.Label;
import com.iker.Lexly.repository.form.BlockRepository;
import com.iker.Lexly.repository.form.FormRepository;
import com.iker.Lexly.repository.form.LabelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class BlockService {

    private final BlockRepository blockRepository;
    private final FormRepository formRepository;
    private final LabelRepository labelRepository;
    private final LabelService labelService;

    @Autowired
    public BlockService(BlockRepository blockRepository, FormRepository formRepository, LabelRepository labelRepository, LabelService labelService) {
        this.blockRepository = blockRepository;
        this.formRepository = formRepository;
        this.labelRepository = labelRepository;
        this.labelService = labelService;
    }

    @Transactional(readOnly = true)
    public List<Block> getAllBlocksByFormId(Long formId) {
        return blockRepository.findByFormId(formId);
    }

    @Transactional
    public Block createBlock(Long formId, Block block) {
        Form form = formRepository.findById(formId).orElseThrow(() -> new IllegalArgumentException("form not found with ID"+formId));
        if (blockRepository.existsByFormIdAndNumberOfBloc(formId, block.getNumberOfBloc())) {
            throw new IllegalArgumentException("Block with number " + block.getNumberOfBloc() + " already exists in form with ID " + formId);
        }
        block.setForm(form);
        return blockRepository.save(block);
    }
    @Transactional
    public List<Block> createManyBlocks(Long formId, List<Block> blocks) {
        Form form = formRepository.findById(formId)
                .orElseThrow(() -> new IllegalArgumentException("Form not found with ID " + formId));

        List<Block> savedBlocks = new ArrayList<>();
        for(Block block : blocks) {
            block.setForm(form);
            savedBlocks.add(blockRepository.save(block));
        }
        return savedBlocks;
    }

    @Transactional(readOnly = true)
    public Block getBlockById(Long blockId) {
        return blockRepository.findById(blockId)
                .orElseThrow(() -> new IllegalArgumentException("Block not found"));
    }

    @Transactional
    public Block updateBlock(Long formId, Long blockId, Block block) {
        Optional<Block> blockOptional = blockRepository.findById(blockId);
        if (blockOptional.isPresent()) {
            Block existingBlock = blockOptional.get();
            existingBlock.setNumberOfBloc(block.getNumberOfBloc());
            return blockRepository.save(existingBlock);
        } else {
            throw new IllegalArgumentException("Block not found");
        }
    }

    @Transactional
    public void deleteBlock(Long blockId) {
        if (blockRepository.existsById(blockId)) {
            List <Label> blockLabels= labelService.getAllLabelsByBlockId(blockId);
            for(Label blockLabel : blockLabels ){
                labelRepository.deleteById(blockLabel.getId());
            }

            blockRepository.deleteById(blockId);
        } else {
            throw new IllegalArgumentException("Block not found");
        }
    }

//    @Transactional
//    public Block duplicateBlock(Long formId, Long blockId) {
//        Form form = formRepository.findById(formId)
//                .orElseThrow(() -> new IllegalArgumentException("Form not found"));
//        Block originalBlock = blockRepository.findById(blockId)
//                .orElseThrow(() -> new IllegalArgumentException("Block not found"));
//
//        Block newBlock = new Block();
//        newBlock.setNumberOfBloc(originalBlock.getNumberOfBloc());
//        newBlock.setForm(form);
//
//        List <Label> originalBlockLabels = labelRepository.findByBlockId(blockId) ;
//        for(Label label : originalBlockLabels) {
//            Label newLabel = new Label();
//            newLabel.setName(label.getName());
//            Map<String, String> originalOptions = label.getOptions();
//            Map<String, String> newOptions = new HashMap<>();
//            for (Map.Entry<String, String> entry : originalOptions.entrySet()) {
//                newOptions.put(entry.getKey(), entry.getValue());
//            }
//            newLabel.setOptions(newOptions);
//            newLabel.setType(label.getType());
//            newLabel.setBlock(newBlock);
//            labelRepository.save(newLabel);
//        }
//
//        return blockRepository.save(newBlock);
//    }

    @Transactional
    public Block duplicateBlock(Long formId, Long blockId) {
        Form form = formRepository.findById(formId)
                .orElseThrow(() -> new IllegalArgumentException("Form not found"));
        Block originalBlock = blockRepository.findById(blockId)
                .orElseThrow(() -> new IllegalArgumentException("Block not found"));

        Block newBlock = new Block();
        newBlock.setNumberOfBloc(originalBlock.getNumberOfBloc());
        newBlock.setForm(form);

        List<Label> originalBlockLabels = labelRepository.findByBlockId(blockId);
        for (Label label : originalBlockLabels) {
            duplicateLabel(label, newBlock); // Pass the new block to the duplicateLabel method
        }

        return blockRepository.save(newBlock);
    }

    public void duplicateLabel(Label originalLabel, Block Block) {
        Label newLabel = new Label();
        newLabel.setName(originalLabel.getName());

        // Duplicate options
        Map<String, String> originalOptions = originalLabel.getOptions();
        Map<String, String> newOptions = new HashMap<>();
        for (Map.Entry<String, String> entry : originalOptions.entrySet()) {
            newOptions.put(entry.getKey(), entry.getValue());
        }
        newLabel.setOptions(newOptions);

        newLabel.setType(originalLabel.getType());
        newLabel.setBlock(Block); // Set the new block for the duplicated label
        labelRepository.save(newLabel);
    }



    @Transactional(readOnly = true)
    public boolean areBlocksEqual(Long formId) {
        List<Block> blocks = blockRepository.findByFormId(formId);

        for (int i = 0; i < blocks.size() - 1; i++) {
            Block currentBlock = blocks.get(i);
            Block nextBlock = blocks.get(i + 1);

            if (!areBlocksPropertiesEqual(currentBlock, nextBlock)) {
                return false;
            }
        }

        return true;
    }

    private boolean areBlocksPropertiesEqual(Block block1, Block block2) {
        List<Label> labelsOfBlock1 = labelRepository.findByBlockId(block1.getId());
        List<Label> labelsOfBlock2 = labelRepository.findByBlockId(block2.getId());

        if (labelsOfBlock1 == null || labelsOfBlock2 == null) {
            return false;
        }
        if (labelsOfBlock1.size() != labelsOfBlock2.size()) {
            return false;
        }
        for (int i = 0; i < labelsOfBlock1.size(); i++) {
            Label label1 = labelsOfBlock1.get(i);
            Label label2 = labelsOfBlock2.get(i);

            if (label1 == null || label2 == null) {
                return false;
            }

            if (!label1.getName().equals(label2.getName()) || !label1.getType().equals(label2.getType())) {
                return false;
            }
        }
        return true;
    }

}






