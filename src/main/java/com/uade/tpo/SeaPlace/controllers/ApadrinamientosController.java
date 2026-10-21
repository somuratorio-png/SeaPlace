package com.uade.tpo.SeaPlace.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.SeaPlace.entity.Apadrinamiento;
import com.uade.tpo.SeaPlace.entity.dto.ApadrinamientoResponse;
import com.uade.tpo.SeaPlace.entity.dto.CambiarPlanRequest;
import com.uade.tpo.SeaPlace.service.ApadrinamientoService;
import com.uade.tpo.SeaPlace.service.SesionService;

@RestController
@RequestMapping("apadrinamientos")
public class ApadrinamientosController {

    @Autowired
    private ApadrinamientoService apadrinamientoService;

    @Autowired
    private SesionService sesionService;

    @GetMapping
    public ResponseEntity<List<ApadrinamientoResponse>> getApadrinamientos() {
        List<ApadrinamientoResponse> resultado = sesionService.getApadrinamientos();
        if (resultado.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(resultado);
    }

    @PutMapping("/{apadrinamientoId}/plan")
    public ResponseEntity<ApadrinamientoResponse> cambiarPlan(@PathVariable Long apadrinamientoId, @RequestBody CambiarPlanRequest request) {
        return ResponseEntity.ok(aRespuesta(apadrinamientoService.cambiarPlan(apadrinamientoId, request.getPlan())));
    }

    @DeleteMapping("/{apadrinamientoId}")
    public ResponseEntity<ApadrinamientoResponse> cancelar(@PathVariable Long apadrinamientoId) {
        return ResponseEntity.ok(aRespuesta(apadrinamientoService.cancelar(apadrinamientoId)));
    }

    private ApadrinamientoResponse aRespuesta(Apadrinamiento apadrinamiento) {
        return sesionService.aRespuesta(apadrinamiento);
    }
}
