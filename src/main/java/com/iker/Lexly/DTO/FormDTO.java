package com.iker.Lexly.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FormDTO {

    private Long id;
    private String title;
    private List<BlockDTO> blocks;


}
