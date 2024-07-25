package com.iker.Lexly.Transformer;

import com.iker.Lexly.DTO.BlockDTO;
import com.iker.Lexly.DTO.LabelDTO;
import com.iker.Lexly.Entity.Form.Block;
import com.iker.Lexly.Entity.Form.Label;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class BlockTransformer extends Transformer<Block, BlockDTO> {

    @Autowired
    private LabelTransformer labelTransformer;

    @Override
    public Block toEntity(BlockDTO dto) {
        if (dto == null) {
            return null;
        } else {
            Block block = new Block();
            block.setId(dto.getId());
            block.setNumberOfBloc(dto.getNumberOfBloc());
            block.setType(dto.getType());
            return block;
        }
    }

    public BlockDTO toDTO(Block entity, List<Label> labels) {
        if (entity == null) {
            return null;
        } else {
            BlockDTO dto = new BlockDTO();
            dto.setId(entity.getId());
            dto.setNumberOfBloc(entity.getNumberOfBloc());
            dto.setType(entity.getType());
            List<LabelDTO> labelDTOs = labels.stream()
                    .map(labelTransformer::toDTO)
                    .collect(Collectors.toList());
            dto.setLabels(labelDTOs);
            return dto;
        }
    }


    @Override
    public BlockDTO toDTO(Block entity) {
        throw new UnsupportedOperationException("Use toDTO(Block entity, List<Label> labels) instead.");
    }
}
