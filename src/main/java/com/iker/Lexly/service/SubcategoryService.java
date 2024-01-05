package com.iker.Lexly.service;

import com.iker.Lexly.DTO.SubcategoryDTO;
import com.iker.Lexly.Entity.Subcategory;
import com.iker.Lexly.Transformer.SubCategoryTransformer;
import com.iker.Lexly.repository.SubcategoryRepository;
import com.iker.Lexly.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SubcategoryService {

    private final SubcategoryRepository subcategoryRepository;
    private final SubCategoryTransformer subcategoryTransformer;

    @Autowired
    public SubcategoryService(SubcategoryRepository subcategoryRepository, SubCategoryTransformer subcategoryTransformer) {
        this.subcategoryRepository = subcategoryRepository;
        this.subcategoryTransformer = subcategoryTransformer;
    }

    public String addSubCategory(SubcategoryDTO subcategoryDTO) {
        if (subcategoryDTO.getCategoryType() == null) {
            return "Category type is not specified.";
        }
        Subcategory subcategory = subcategoryTransformer.toEntity(subcategoryDTO);
        subcategoryRepository.save(subcategory);
        return "Subcategory added successfully.";
    }

    public ApiResponse updateSubCategory(Long subcategoryId, SubcategoryDTO subcategoryDTO) {
        if (subcategoryDTO.getCategoryType() == null) {
            return new ApiResponse("Category type is not specified.", null);
        }

        Optional<Subcategory> existingSubcategoryOptional = subcategoryRepository.findById(subcategoryId);

        if (existingSubcategoryOptional.isPresent()) {
            Subcategory existingSubcategory = existingSubcategoryOptional.get();
            Subcategory updatedSubcategory = subcategoryTransformer.toEntity(subcategoryDTO);
            updatedSubcategory.setId(existingSubcategory.getId());
            subcategoryRepository.save(updatedSubcategory);

            return new ApiResponse("Subcategory updated successfully.", null);
        } else {
            return new ApiResponse("Subcategory with ID " + subcategoryId + " not found.", null);
        }
    }


    public String deleteSubCategory(Long subcategoryId) {
        Optional<Subcategory> subcategoryOptional = subcategoryRepository.findById(subcategoryId);

        if (subcategoryOptional.isPresent()) {
            Subcategory subcategory = subcategoryOptional.get();
            subcategoryRepository.delete(subcategory);

            return "Subcategory deleted successfully.";
        } else {
            return "Subcategory with ID " + subcategoryId + " not found.";
        }
    }

    public List<SubcategoryDTO> getAllSubcategories() {
        List<Subcategory> subcategories = subcategoryRepository.findAll();
        return subcategoryTransformer.toDTOList(subcategories);
    }

    public SubcategoryDTO getSubcategoryById(Long subcategoryId) {
        Optional<Subcategory> subcategoryOptional = subcategoryRepository.findById(subcategoryId);
        return subcategoryOptional.map(subcategoryTransformer::toDTO).orElse(null);
    }
}
