package com.uade.tpo.SeaPlace.service;

import java.util.List;
import java.util.Optional;

import com.uade.tpo.SeaPlace.entity.Categoria;
import com.uade.tpo.SeaPlace.entity.dto.CategoriaRequest;

public interface CategoriaService {
    List<Categoria> getCategorias();

    Optional<Categoria> getCategoriaById(Long categoriaId);

    Categoria createCategoria(CategoriaRequest request);
}