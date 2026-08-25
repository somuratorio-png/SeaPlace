package com.uade.tpo.SeaPlace.controllers;

import java.net.URI;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.SeaPlace.entity.Compra;
import com.uade.tpo.SeaPlace.entity.dto.CompraRequest;
import com.uade.tpo.SeaPlace.service.CompraService;

@RestController
@RequestMapping("compras")
public class ComprasController {

    @Autowired
    private CompraService compraService;

    @GetMapping
    public ResponseEntity<Page<Compra>> getCompras(
            @RequestParam Long idUsuario,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        PageRequest pageRequest = (page == null || size == null)
                ? PageRequest.of(0, Integer.MAX_VALUE)
                : PageRequest.of(page, size);
        return ResponseEntity.ok(compraService.getComprasByUsuario(idUsuario, pageRequest));
    }

    @GetMapping("/{compraId}")
    public ResponseEntity<Compra> getCompraById(@PathVariable Long compraId) {
        Optional<Compra> result = compraService.getCompraById(compraId);
        return result.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // confirma la compra a partir del carrito (acá vive la lógica: valida disponibilidad, aplica descuentos, arma el detalle)
    @PostMapping
    public ResponseEntity<Compra> confirmarCompra(@RequestBody CompraRequest request) {
        Compra result = compraService.confirmarCompra(request);
        return ResponseEntity.created(URI.create("/compras/" + result.getIdCompra())).body(result);
    }
}
