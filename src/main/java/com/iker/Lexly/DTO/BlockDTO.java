package com.iker.Lexly.DTO;

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
    private List<LabelDTO> labels;
}
