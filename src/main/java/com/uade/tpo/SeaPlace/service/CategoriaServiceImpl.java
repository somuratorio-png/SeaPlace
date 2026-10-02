package com.uade.tpo.SeaPlace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;   
import org.springframework.stereotype.Service;

import com.uade.tpo.SeaPlace.entity.Categoria;
import com.uade.tpo.SeaPlace.entity.dto.CategoriaRequest;
import com.uade.tpo.SeaPlace.exceptions.RecursoDuplicadoException;
import com.uade.tpo.SeaPlace.exceptions.ReglaDeNegocioException;
import com.uade.tpo.SeaPlace.repository.CategoriaRepository;

@Service
public class CategoriaServiceImpl implements CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired                                                      
    private AutorizacionService autorizacionService;                

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
        if (!autorizacionService.esAdmin()) {                                           
            throw new AccessDeniedException("No tenes permiso para crear categorias");  
        }                                                                               

        String nombreCategoria = request.getNombreCategoria() == null ? "" : request.getNombreCategoria().trim();
        if (nombreCategoria.isEmpty()) {
            throw new ReglaDeNegocioException("El nombre de la categoria es obligatorio");
        }
        if (nombreCategoria.length() > 255) {
            throw new ReglaDeNegocioException("El nombre de la categoria no puede superar los 255 caracteres");
        }

        Optional<Categoria> existente = categoriaRepository.findByNombreCategoria(nombreCategoria);
        if (existente.isPresent()) {
            throw new RecursoDuplicadoException(
                    "Ya existe una categoria con el nombre " + nombreCategoria);
        }

        Categoria categoria = new Categoria();
        categoria.setNombreCategoria(nombreCategoria);
        categoria.setDescripcion(request.getDescripcion());
        return categoriaRepository.save(categoria);
    }
}