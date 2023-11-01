package com.iker.Lexly.service;

import com.iker.Lexly.Entity.Category;
import com.iker.Lexly.Entity.Template;
import com.iker.Lexly.repository.CategoryRepository;
import com.iker.Lexly.repository.TemplateRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

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
        return categoryRepository.save(category);
    }
    public boolean categoryExists(Long categoryId) {
        return categoryRepository.existsById(categoryId);
    }

    // Method to update a category
    public Category updateCategory(Long categoryId, Category updatedCategory) {
        if (categoryRepository.existsById(categoryId)) {
            updatedCategory.setId(categoryId);
            return categoryRepository.save(updatedCategory);
        }
        return null;
    }
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    public String deleteCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with ID: " + categoryId));

        if (category.getTemplates() != null && !category.getTemplates().isEmpty()) {
            // If the category is associated with templates, delete the templates first
            List<Template> templates = category.getTemplates();
            templateRepository.deleteAll(templates);

            return "The category and associated templates have been deleted successfully.";
        } else {
            categoryRepository.delete(category);

            return "The category has been deleted successfully.";
        }
    }



    public Category getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElse(null);
    }

}
