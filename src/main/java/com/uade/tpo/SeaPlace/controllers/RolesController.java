package com.uade.tpo.SeaPlace.controllers;

import java.net.URI;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.SeaPlace.entity.Rol;
import com.uade.tpo.SeaPlace.entity.dto.RolRequest;
import com.uade.tpo.SeaPlace.entity.dto.RolResponse;
import com.uade.tpo.SeaPlace.service.RolService;

@RestController
@RequestMapping("roles")
public class RolesController {

    @Autowired
    private RolService rolService;

    @GetMapping
    public ResponseEntity<List<RolResponse>> getRoles() {
        return ResponseEntity.ok(rolService.getRoles().stream().map(RolResponse::fromEntity).toList());
    }

    @GetMapping("/{rolId}")
    public ResponseEntity<RolResponse> getRolById(@PathVariable Long rolId) {
        Optional<Rol> result = rolService.getRolById(rolId);
        return result.map(r -> ResponseEntity.ok(RolResponse.fromEntity(r))).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<RolResponse> createRol(@RequestBody RolRequest request) {
        Rol result = rolService.createRol(request);
        return ResponseEntity.created(URI.create("/roles/" + result.getIdRol())).body(RolResponse.fromEntity(result));
    }
}
