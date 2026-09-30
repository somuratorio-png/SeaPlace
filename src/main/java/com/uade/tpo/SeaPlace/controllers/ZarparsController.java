package com.uade.tpo.SeaPlace.controllers;

import java.net.URI;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.SeaPlace.entity.Zarpar;
import com.uade.tpo.SeaPlace.entity.dto.ZarparRequest;
import com.uade.tpo.SeaPlace.entity.dto.ZarparResponse;
import com.uade.tpo.SeaPlace.service.ZarparService;

@RestController
@RequestMapping("zarpar")
public class ZarparsController {

    @Autowired
    private ZarparService zarparService;

    @GetMapping
    public ResponseEntity<Page<ZarparResponse>> getZarpars(
            @RequestParam Long idUsuario,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        PageRequest pageRequest = (page == null || size == null)
                ? PageRequest.of(0, Integer.MAX_VALUE)
                : PageRequest.of(page, size);
        return ResponseEntity.ok(zarparService.getZarparsByUsuario(idUsuario, pageRequest).map(ZarparResponse::fromEntity));
    }

    @GetMapping("/{zarparId}")
    public ResponseEntity<ZarparResponse> getZaparById(@PathVariable Long zarparId) {
        Optional<Zarpar> result = zarparService.getZarparById(zarparId);
        return result.map(c -> ResponseEntity.ok(ZarparResponse.fromEntity(c))).orElse(ResponseEntity.notFound().build());
    }

    // confirma la compra a partir del carrito (acá vive la lógica: valida disponibilidad, aplica descuentos, arma el detalle)
    @PostMapping
    public ResponseEntity<ZarparResponse> confirmarZarpar(@RequestBody ZarparRequest request) {
        Zarpar result = zarparService.confirmarZarpar(request);
        return ResponseEntity.created(URI.create("/zarpar/" + result.getIdZarpar())).body(ZarparResponse.fromEntity(result));
    }
}
