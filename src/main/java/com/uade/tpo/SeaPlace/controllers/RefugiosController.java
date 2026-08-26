package com.uade.tpo.SeaPlace.controllers;

import java.net.URI;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.SeaPlace.entity.Refugio;
import com.uade.tpo.SeaPlace.entity.dto.RefugioRequest;
import com.uade.tpo.SeaPlace.entity.dto.RefugioResponse;
import com.uade.tpo.SeaPlace.service.RefugioService;

@RestController
@RequestMapping("refugios")
public class RefugiosController {

    @Autowired
    private RefugioService refugioService;

    @GetMapping
    public ResponseEntity<List<RefugioResponse>> getRefugios() {
        return ResponseEntity.ok(refugioService.getRefugios().stream().map(RefugioResponse::fromEntity).toList());
    }

    @GetMapping("/{refugioId}")
    public ResponseEntity<RefugioResponse> getRefugioById(@PathVariable Long refugioId) {
        Optional<Refugio> result = refugioService.getRefugioById(refugioId);
        return result.map(r -> ResponseEntity.ok(RefugioResponse.fromEntity(r))).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<RefugioResponse> createRefugio(@RequestBody RefugioRequest request) {
        Refugio result = refugioService.createRefugio(request);
        return ResponseEntity.created(URI.create("/refugios/" + result.getIdRefugio())).body(RefugioResponse.fromEntity(result));
    }
}
