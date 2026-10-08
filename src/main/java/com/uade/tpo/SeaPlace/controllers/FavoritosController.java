package com.uade.tpo.SeaPlace.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.SeaPlace.entity.dto.FavoritoResponse;
import com.uade.tpo.SeaPlace.service.FavoritoService;

@RestController
@RequestMapping("favoritos")
public class FavoritosController {

    @Autowired
    private FavoritoService favoritoService;

    // favoritos del usuario logueado (el del token)
    @GetMapping
    public ResponseEntity<List<FavoritoResponse>> getFavoritos() {
        List<FavoritoResponse> resultado = favoritoService.getFavoritos().stream().map(FavoritoResponse::fromEntity).toList();
        // Si no hay nada para devolver, se responde 204 (sin cuerpo) en vez de un array vacio.
        if (resultado.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(resultado);
    }

    // PUT y no POST: guardar dos veces el mismo animal deja todo igual
    @PutMapping("/{animalId}")
    public ResponseEntity<FavoritoResponse> agregarFavorito(@PathVariable Long animalId) {
        return ResponseEntity.ok(FavoritoResponse.fromEntity(favoritoService.agregarFavorito(animalId)));
    }

    @DeleteMapping("/{animalId}")
    public ResponseEntity<Void> quitarFavorito(@PathVariable Long animalId) {
        favoritoService.quitarFavorito(animalId);
        return ResponseEntity.noContent().build();
    }
}
