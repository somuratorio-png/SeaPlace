package com.uade.tpo.SeaPlace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.SeaPlace.entity.Categoria;
import com.uade.tpo.SeaPlace.entity.dto.CategoriaRequest;
import com.uade.tpo.SeaPlace.exceptions.RecursoDuplicadoException;
import com.uade.tpo.SeaPlace.repository.CategoriaRepository;

@Service
public class CategoriaServiceImpl implements CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Override
    public List<Categoria> getCategorias() {
        return categoriaRepository.findAll();
    }

    @Override
    public Optional<Categoria> getCategoriaById(Long categoriaId) {
        return categoriaRepository.findById(categoriaId);
    }

    @Override
    public Categoria createCategoria(CategoriaRequest request) {
        Optional<Categoria> existente = categoriaRepository.findByNombreCategoria(request.getNombreCategoria());
        if (existente.isPresent()) {
            throw new RecursoDuplicadoException(
                    "Ya existe una categoria con el nombre " + request.getNombreCategoria());
        }

        Categoria categoria = new Categoria();
        categoria.setNombreCategoria(request.getNombreCategoria());
        categoria.setDescripcion(request.getDescripcion());
        return categoriaRepository.save(categoria);
    }
}