// controllers/CategoriaController.java
package com.uade.tpo.SeaPlace.controllers;

import java.net.URI;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.SeaPlace.entity.Categoria;
import com.uade.tpo.SeaPlace.entity.dto.CategoriaRequest;
import com.uade.tpo.SeaPlace.service.CategoriaService;

@RestController
@RequestMapping("categorias")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping
    public ResponseEntity<List<Categoria>> getCategorias() {
        return ResponseEntity.ok(categoriaService.getCategorias());
    }

    @GetMapping("/{categoriaId}")
    public ResponseEntity<Categoria> getCategoriaById(@PathVariable Long categoriaId) {
        Optional<Categoria> result = categoriaService.getCategoriaById(categoriaId);
        return result.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Categoria> createCategoria(@RequestBody CategoriaRequest request) {
        Categoria result = categoriaService.createCategoria(request);
        return ResponseEntity.created(URI.create("/categorias/" + result.getIdCategoria())).body(result);
    }
}
