package com.uade.tpo.SeaPlace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.uade.tpo.SeaPlace.entity.Categoria;
import com.uade.tpo.SeaPlace.exceptions.CategoryDuplicateException;
import com.uade.tpo.SeaPlace.repository.CategoriaRepository;

@Service
public class CategoriaServiceImpl implements CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    public Page<Categoria> getCategories(PageRequest pageable) {
        return categoriaRepository.findAll(pageable);
    }

    public Optional<Categoria> getCategoryById(Long categoryId) {
        return categoriaRepository.findById(categoryId);
    }

    public Categoria createCategory(String description) throws CategoryDuplicateException {
        List<Categoria> categories = categoriaRepository.findByDescription(description);
        if (categories.isEmpty())
            return categoriaRepository.save(new Categoria(description));
        throw new CategoryDuplicateException();
    }
}
