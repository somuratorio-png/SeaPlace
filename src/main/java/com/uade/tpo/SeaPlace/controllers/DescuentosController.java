package com.uade.tpo.SeaPlace.controllers;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.SeaPlace.entity.Descuento;
import com.uade.tpo.SeaPlace.entity.dto.DescuentoRequest;
import com.uade.tpo.SeaPlace.entity.dto.DescuentoResponse;
import com.uade.tpo.SeaPlace.service.DescuentoService;

@RestController
@RequestMapping("animales/{animalId}/descuentos")
public class DescuentosController {

    @Autowired
    private DescuentoService descuentoService;

    @GetMapping
    public ResponseEntity<List<DescuentoResponse>> getDescuentosActivos(@PathVariable Long animalId) {
        List<DescuentoResponse> resultado = descuentoService.getDescuentosActivos(animalId).stream().map(DescuentoResponse::fromEntity).toList();
        // Si no hay nada para devolver, se responde 204 (sin cuerpo) en vez de un array vacio.
        if (resultado.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(resultado);
    }

    @PostMapping
    public ResponseEntity<DescuentoResponse> createDescuento(@PathVariable Long animalId, @RequestBody DescuentoRequest request) {
        request.setIdAnimal(animalId);
        Descuento result = descuentoService.createDescuento(request);
        return ResponseEntity.created(URI.create("/animales/" + animalId + "/descuentos/" + result.getIdDescuento())).body(DescuentoResponse.fromEntity(result));
    }
}
