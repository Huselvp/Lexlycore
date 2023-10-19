package com.iker.Lexly.Transformer;

import java.util.ArrayList;
import java.util.List;


public abstract class Transformer<Entity, DTO> {

    public abstract Entity toEntity(DTO dto);

    public abstract DTO toDTO(Entity entity);

    public List<Entity> toEntityList(Iterable<DTO> dtoList) {
        List<Entity> entities = new ArrayList<>();
        for (DTO dto : dtoList) {
            entities.add(toEntity(dto));
        }
        return entities;
    }

    public List<DTO> toDTOList(Iterable<Entity> entityList) {
        List<DTO> dtos = new ArrayList<>();
        for (Entity entity : entityList) {
            dtos.add(toDTO(entity));
        }
        return dtos;
    }

}