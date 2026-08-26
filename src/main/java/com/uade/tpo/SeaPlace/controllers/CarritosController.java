package com.uade.tpo.SeaPlace.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.SeaPlace.entity.Carrito;
import com.uade.tpo.SeaPlace.entity.CarritoDetalle;
import com.uade.tpo.SeaPlace.entity.dto.CarritoDetalleRequest;
import com.uade.tpo.SeaPlace.service.CarritoService;

@RestController
@RequestMapping("carritos")
public class CarritosController {

    @Autowired
    private CarritoService carritoService;

    // carrito activo del usuario logueado (o el que se pase por param, mientras no haya login)
    @GetMapping
    public ResponseEntity<Carrito> getCarritoActivo(@RequestParam Long idUsuario) {
        return ResponseEntity.ok(carritoService.getOrCreateCarritoActivo(idUsuario));
    }

    @PostMapping("/items")
    public ResponseEntity<CarritoDetalle> agregarItem(@RequestBody CarritoDetalleRequest request) {
        CarritoDetalle result = carritoService.agregarItem(request);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{carritoId}/items/{animalId}")
    public ResponseEntity<CarritoDetalle> modificarCantidad(@PathVariable Long carritoId, @PathVariable Long animalId, @RequestBody CarritoDetalleRequest request) {
        return ResponseEntity.ok(carritoService.modificarCantidad(carritoId, animalId, request.getCantidad()));
    }

    @DeleteMapping("/{carritoId}/items/{animalId}")
    public ResponseEntity<Void> quitarItem(@PathVariable Long carritoId, @PathVariable Long animalId) {
        carritoService.quitarItem(carritoId, animalId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{carritoId}/items")
    public ResponseEntity<List<CarritoDetalle>> getItems(@PathVariable Long carritoId) {
        return ResponseEntity.ok(carritoService.getItems(carritoId));
    }
}