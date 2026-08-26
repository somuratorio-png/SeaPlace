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
import com.uade.tpo.SeaPlace.entity.dto.CompraResponse;
import com.uade.tpo.SeaPlace.service.CompraService;

@RestController
@RequestMapping("compras")
public class ComprasController {

    @Autowired
    private CompraService compraService;

    @GetMapping
    public ResponseEntity<Page<CompraResponse>> getCompras(
            @RequestParam Long idUsuario,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        PageRequest pageRequest = (page == null || size == null)
                ? PageRequest.of(0, Integer.MAX_VALUE)
                : PageRequest.of(page, size);
        return ResponseEntity.ok(compraService.getComprasByUsuario(idUsuario, pageRequest).map(CompraResponse::fromEntity));
    }

    @GetMapping("/{compraId}")
    public ResponseEntity<CompraResponse> getCompraById(@PathVariable Long compraId) {
        Optional<Compra> result = compraService.getCompraById(compraId);
        return result.map(c -> ResponseEntity.ok(CompraResponse.fromEntity(c))).orElse(ResponseEntity.notFound().build());
    }

    // confirma la compra a partir del carrito (acá vive la lógica: valida disponibilidad, aplica descuentos, arma el detalle)
    @PostMapping
    public ResponseEntity<CompraResponse> confirmarCompra(@RequestBody CompraRequest request) {
        Compra result = compraService.confirmarCompra(request);
        return ResponseEntity.created(URI.create("/compras/" + result.getIdCompra())).body(CompraResponse.fromEntity(result));
    }
}
