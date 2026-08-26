package com.uade.tpo.SeaPlace.controllers;

import java.net.URI;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.SeaPlace.entity.Permiso;
import com.uade.tpo.SeaPlace.entity.dto.PermisoRequest;
import com.uade.tpo.SeaPlace.entity.dto.PermisoResponse;
import com.uade.tpo.SeaPlace.entity.dto.RolResponse;
import com.uade.tpo.SeaPlace.entity.dto.AsignarPermisosRequest;
import com.uade.tpo.SeaPlace.entity.Rol;
import com.uade.tpo.SeaPlace.service.PermisoService;
import com.uade.tpo.SeaPlace.service.RolService;

@RestController
public class PermisosController {

    @Autowired
    private PermisoService permisoService;

    @Autowired
    private RolService rolService;

    @GetMapping("permisos")
    public ResponseEntity<List<PermisoResponse>> getPermisos() {
        return ResponseEntity.ok(permisoService.getPermisos().stream().map(PermisoResponse::fromEntity).toList());
    }

    @GetMapping("permisos/{permisoId}")
    public ResponseEntity<PermisoResponse> getPermisoById(@PathVariable Long permisoId) {
        Optional<Permiso> result = permisoService.getPermisoById(permisoId);
        return result.map(p -> ResponseEntity.ok(PermisoResponse.fromEntity(p))).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("permisos")
    public ResponseEntity<PermisoResponse> createPermiso(@RequestBody PermisoRequest request) {
        Permiso result = permisoService.createPermiso(request);
        return ResponseEntity.created(URI.create("/permisos/" + result.getIdPermiso())).body(PermisoResponse.fromEntity(result));
    }

    // asigna permisos a un rol (reemplaza a RolPermiso)
    @PostMapping("roles/{rolId}/permisos")
    public ResponseEntity<RolResponse> asignarPermisos(@PathVariable Long rolId, @RequestBody AsignarPermisosRequest request) {
        Rol result = rolService.asignarPermisos(rolId, request);
        return ResponseEntity.ok(RolResponse.fromEntity(result));
    }
}
