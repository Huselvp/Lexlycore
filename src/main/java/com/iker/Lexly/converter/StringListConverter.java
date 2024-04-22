package com.iker.Lexly.converter;
import jakarta.persistence.AttributeConverter;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class StringListConverter implements AttributeConverter<List<Long>, String> {
    @Override
    public String convertToDatabaseColumn(List<Long> attribute) {
        if (attribute == null) {
            return null;
        }
        return String.join(",", attribute.stream().map(Object::toString).collect(Collectors.toList()));
    }

    @Override
    public List<Long> convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return Arrays.stream(dbData.split(","))
                .map(Long::valueOf)
                .collect(Collectors.toList());
    }
}
