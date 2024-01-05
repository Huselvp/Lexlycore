package com.iker.Lexly.Transformer;
import com.iker.Lexly.DTO.SubcategoryDTO;
import org.springframework.stereotype.Component;
import com.iker.Lexly.Entity.Subcategory;

@Component
public class SubCategoryTransformer extends Transformer<Subcategory, SubcategoryDTO> {

    @Override
    public Subcategory toEntity(SubcategoryDTO dto) {
        if (dto == null) {
            return null;
        } else {
            Subcategory subcategory = new Subcategory();
            subcategory.setId(dto.getId());
            subcategory.setName(dto.getName());
            subcategory.setCategoryType(dto.getCategoryType());

            return subcategory;
        }
    }

    @Override
    public SubcategoryDTO toDTO(Subcategory entity) {
        if (entity == null) {
            return null;
        } else {
            return SubcategoryDTO.builder()
                    .id(entity.getId())
                    .name(entity.getName())
                    .categoryType(entity.getCategoryType())
                    .build();
        }
    }
}



