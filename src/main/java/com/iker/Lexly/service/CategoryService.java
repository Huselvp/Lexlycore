package com.iker.Lexly.service;

import com.iker.Lexly.DTO.CategoryDTO;
import com.iker.Lexly.Entity.Category;
import com.iker.Lexly.Entity.Template;
import com.iker.Lexly.repository.CategoryRepository;
import com.iker.Lexly.repository.TemplateRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final TemplateRepository templateRepository;

    @Autowired
    public CategoryService(TemplateRepository templateRepository,CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
        this.templateRepository=templateRepository;
    }
    public Category addCategory(Category category) {
        String categoryName = category.getCategory();

        Optional<Category> existingCategory = categoryRepository.findByCategory(categoryName);
        if (existingCategory.isPresent()) {
            throw new IllegalArgumentException("Category with name '" + categoryName + "' already exists.");
        }
        return categoryRepository.save(category);
    }
    public boolean categoryExists(Long categoryId) {
        return categoryRepository.existsById(categoryId);
    }
    public Category updateCategory(Long categoryId, CategoryDTO categoryDTO) {
        Optional<Category> existingCategoryOptional = categoryRepository.findById(categoryId);

        if (existingCategoryOptional.isPresent()) {
            Category existingCategory = existingCategoryOptional.get();
            Category updatedCategory = existingCategory;
            updatedCategory.setCategory(categoryDTO.getCategory());
            if (!existingCategory.getTemplates().isEmpty()) {
                List<Template> associatedTemplates = existingCategory.getTemplates();
                for (Template template : associatedTemplates) {
                    template.setCategory(updatedCategory);
                    templateRepository.save(template);
                }
            }
            return categoryRepository.save(updatedCategory);
        } else {
            return null;
        }
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    public String deleteCategory(Long categoryId) {
        Optional<Category> categoryOptional = categoryRepository.findById(categoryId);
        if (categoryOptional.isPresent()) {
            Category category = categoryOptional.get();
            if (!category.getTemplates().isEmpty()) {
                List<Template> templates = new ArrayList<>(category.getTemplates());
                templateRepository.deleteAll(templates);
            }
            categoryRepository.delete(category);

            return "The category and associated templates have been deleted successfully.";
        } else {
            return "Category with ID " + categoryId + " not found.";
        }
    }
    public Category getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElse(null);
    }

}
