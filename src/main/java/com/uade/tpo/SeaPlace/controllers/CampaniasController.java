package com.uade.tpo.SeaPlace.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.SeaPlace.entity.dto.CampaniaResponse;
import com.uade.tpo.SeaPlace.entity.dto.RechazoRequest;
import com.uade.tpo.SeaPlace.service.PatrocinadorService;

// Las campañas de duplicacion vistas desde el refugio: las que le proponen para sus animales,
// y aceptarlas o rechazarlas. (El patrocinador maneja las suyas en /patrocinadores/me/campanias.)
@RestController
@RequestMapping("campanias")
public class CampaniasController {

    @Autowired
    private PatrocinadorService patrocinadorService;

    // las de los animales del refugio logueado (un admin ve todas), de la mas nueva a la mas vieja
    @GetMapping
    public ResponseEntity<List<CampaniaResponse>> getCampanias() {
        List<CampaniaResponse> resultado = patrocinadorService.getCampaniasDeMiRefugio();
        // Si no hay nada para devolver, se responde 204 (sin cuerpo) en vez de un array vacio.
        if (resultado.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(resultado);
    }

    @PutMapping("/{campaniaId}/aceptar")
    public ResponseEntity<CampaniaResponse> aceptar(@PathVariable Long campaniaId) {
        return ResponseEntity.ok(patrocinadorService.aceptarCampania(campaniaId));
    }

    // el motivo es opcional: { "motivo": "..." } o sin cuerpo
    @PutMapping("/{campaniaId}/rechazar")
    public ResponseEntity<CampaniaResponse> rechazar(@PathVariable Long campaniaId, @RequestBody(required = false) RechazoRequest request) {
        return ResponseEntity.ok(patrocinadorService.rechazarCampania(campaniaId, request == null ? null : request.getMotivo()));
    }
}
