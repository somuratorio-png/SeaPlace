
package com.uade.tpo.SeaPlace.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import com.uade.tpo.SeaPlace.entity.Category;
import com.uade.tpo.SeaPlace.exceptions.CategoryDuplicateException;

public interface CategoryService {
    public Page<Category> getCategories(PageRequest pageRequest);

    public Optional<Category> getCategoryById(Long categoryId);

    public Category createCategory(String description) throws CategoryDuplicateException;
}