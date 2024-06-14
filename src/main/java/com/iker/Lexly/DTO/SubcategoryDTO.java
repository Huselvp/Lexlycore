package com.iker.Lexly.DTO;

import com.iker.Lexly.Entity.enums.CategoryType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubcategoryDTO {
    private Long id;
    private String name;
    private CategoryType categoryType;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public CategoryType getCategoryType() {
        return categoryType;
    }
    public void setCategoryType(CategoryType categoryType) {
        this.categoryType = categoryType;
    }
}

