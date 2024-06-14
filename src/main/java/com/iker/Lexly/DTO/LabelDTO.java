package com.iker.Lexly.DTO;

import com.iker.Lexly.Entity.Form.LabelType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LabelDTO {
    private Long id;
    private String name;
    private LabelType type;
    private Map<Long, String> options;
}
