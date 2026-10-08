package com.uade.tpo.SeaPlace.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.SeaPlace.entity.Apadrinamiento;
import com.uade.tpo.SeaPlace.entity.dto.ApadrinamientoResponse;
import com.uade.tpo.SeaPlace.entity.dto.CambiarPlanRequest;
import com.uade.tpo.SeaPlace.service.ApadrinamientoService;

@RestController
@RequestMapping("apadrinamientos")
public class ApadrinamientosController {

    @Autowired
    private ApadrinamientoService apadrinamientoService;

    // los que le corresponden al usuario logueado: un admin ve todos, un refugio los de sus
    // animales y un padrino los propios (activos y cancelados)
    @GetMapping
    public ResponseEntity<List<ApadrinamientoResponse>> getApadrinamientos() {
        List<ApadrinamientoResponse> resultado = apadrinamientoService.getApadrinamientos().stream().map(this::aRespuesta).toList();
        // Si no hay nada para devolver, se responde 204 (sin cuerpo) en vez de un array vacio.
        if (resultado.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(resultado);
    }

    @PutMapping("/{apadrinamientoId}/plan")
    public ResponseEntity<ApadrinamientoResponse> cambiarPlan(@PathVariable Long apadrinamientoId, @RequestBody CambiarPlanRequest request) {
        return ResponseEntity.ok(aRespuesta(apadrinamientoService.cambiarPlan(apadrinamientoId, request.getPlan())));
    }

    // cancelar no borra el apadrinamiento: lo deja inactivo y libera sus cupos
    @DeleteMapping("/{apadrinamientoId}")
    public ResponseEntity<ApadrinamientoResponse> cancelar(@PathVariable Long apadrinamientoId) {
        return ResponseEntity.ok(aRespuesta(apadrinamientoService.cancelar(apadrinamientoId)));
    }

    private ApadrinamientoResponse aRespuesta(Apadrinamiento apadrinamiento) {
        return ApadrinamientoResponse.fromEntity(apadrinamiento, apadrinamientoService.getPagos(apadrinamiento));
    }
}
