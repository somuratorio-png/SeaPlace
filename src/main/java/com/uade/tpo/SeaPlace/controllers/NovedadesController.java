package com.uade.tpo.SeaPlace.controllers;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.SeaPlace.entity.Novedad;
import com.uade.tpo.SeaPlace.entity.dto.NovedadRequest;
import com.uade.tpo.SeaPlace.entity.dto.NovedadResponse;
import com.uade.tpo.SeaPlace.service.NovedadService;

@RestController
@RequestMapping("animales/{animalId}/novedades")
public class NovedadesController {

    @Autowired
    private NovedadService novedadService;

    @GetMapping
    public ResponseEntity<List<NovedadResponse>> getNovedades(@PathVariable Long animalId) {
        List<NovedadResponse> resultado = novedadService.getNovedades(animalId).stream().map(NovedadResponse::fromEntity).toList();
        if (resultado.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(resultado);
    }

    @PostMapping
    public ResponseEntity<NovedadResponse> createNovedad(@PathVariable Long animalId, @RequestBody NovedadRequest request) {
        Novedad result = novedadService.createNovedad(animalId, request);
        return ResponseEntity.created(URI.create("/animales/" + animalId + "/novedades/" + result.getIdNovedad())).body(NovedadResponse.fromEntity(result));
    }
}
