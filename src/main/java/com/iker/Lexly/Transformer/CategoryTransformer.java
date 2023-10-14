package com.iker.Lexly.Transformer;

import com.iker.Lexly.DTO.CategoryDTO;
import com.iker.Lexly.DTO.QuestionDTO;
import com.iker.Lexly.Entity.Category;
import com.iker.Lexly.Entity.Question;
import org.springframework.stereotype.Component;

@Component
public class CategoryTransformer extends Transformer<Category ,CategoryDTO>{

    @Override
    public Category toEntity(CategoryDTO dto) {
        if (dto == null) {
            return null;
        } else {
           Category category = new Category();
           category.setId(dto.getId());
           category.setCategory(category.getCategory());

           return category;
        }
    }

    @Override
    public CategoryDTO toDTO(Category entity) {
        if (entity == null) {
            return null;
        } else {
            return new CategoryDTO(entity.getId(), entity.getCategory());
        }
    }

}