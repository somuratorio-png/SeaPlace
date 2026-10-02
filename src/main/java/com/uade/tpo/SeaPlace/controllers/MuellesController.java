package com.uade.tpo.SeaPlace.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.SeaPlace.entity.MuelleDetalle;
import com.uade.tpo.SeaPlace.entity.dto.MuelleDetalleRequest;
import com.uade.tpo.SeaPlace.entity.dto.MuelleDetalleResponse;
import com.uade.tpo.SeaPlace.entity.dto.MuelleResponse;
import com.uade.tpo.SeaPlace.service.MuelleService;
import com.uade.tpo.SeaPlace.service.AutorizacionService;

@RestController
@RequestMapping("muelles")
public class MuellesController {

    @Autowired
    private MuelleService muelleService;

    @Autowired
    private AutorizacionService autorizacionService;

    // muelle activo del usuario logueado (el del token)
    @GetMapping
    public ResponseEntity<MuelleResponse> getMuelleActivo() {
        return ResponseEntity.ok(MuelleResponse.fromEntity(
                muelleService.getOrCreateMuelleActivo(autorizacionService.idUsuarioActual())));
    }

    @PostMapping("/items")
    public ResponseEntity<MuelleDetalleResponse> agregarItem(@RequestBody MuelleDetalleRequest request) {
        MuelleDetalle result = muelleService.agregarItem(request);
        return ResponseEntity.ok(MuelleDetalleResponse.fromEntity(result));
    }

    @PutMapping("/{muelleId}/items/{animalId}")
    public ResponseEntity<MuelleDetalleResponse> modificarCantidad(@PathVariable Long muelleId, @PathVariable Long animalId, @RequestBody MuelleDetalleRequest request) {
        return ResponseEntity.ok(MuelleDetalleResponse.fromEntity(muelleService.modificarCantidad(muelleId, animalId, request.getCantidad())));
    }

    @DeleteMapping("/{muelleId}/items/{animalId}")
    public ResponseEntity<Void> quitarItem(@PathVariable Long muelleId, @PathVariable Long animalId) {
        muelleService.quitarItem(muelleId, animalId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{muelleId}/items")
    public ResponseEntity<List<MuelleDetalleResponse>> getItems(@PathVariable Long muelleId) {
        return ResponseEntity.ok(muelleService.getItems(muelleId).stream().map(MuelleDetalleResponse::fromEntity).toList());
    }
}
