package com.iker.Lexly.repository;
import com.iker.Lexly.Entity.Subcategory;
import com.iker.Lexly.Entity.enums.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubcategoryRepository extends JpaRepository<Subcategory, Long> {

    List<Subcategory> findByCategoryType(CategoryType categoryType);
    Subcategory findByIdAndCategoryType(Long id, CategoryType categoryType);
    List<Subcategory> findAllByCategoryType(CategoryType categoryType);
}
