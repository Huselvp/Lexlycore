package com.iker.Lexly.DTO;

import com.iker.Lexly.Entity.Form.BlockType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlockDTO {
    private Long id;
    private int numberOfBloc;
    private BlockType type;

    private List<LabelDTO> labels;
}
