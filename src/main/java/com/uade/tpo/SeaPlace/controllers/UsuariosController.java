package com.uade.tpo.SeaPlace.controllers;

import java.net.URI;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.SeaPlace.entity.Usuario;
import com.uade.tpo.SeaPlace.entity.dto.UsuarioRequest;
import com.uade.tpo.SeaPlace.entity.dto.UsuarioResponse;
import com.uade.tpo.SeaPlace.service.UsuarioService;

@RestController
@RequestMapping("usuarios")
public class UsuariosController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<Page<UsuarioResponse>> getUsuarios(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        if (page == null || size == null)
            return ResponseEntity.ok(usuarioService.getUsuarios(PageRequest.of(0, Integer.MAX_VALUE)).map(UsuarioResponse::fromEntity));
        return ResponseEntity.ok(usuarioService.getUsuarios(PageRequest.of(page, size)).map(UsuarioResponse::fromEntity));
    }

    @GetMapping("/{usuarioId}")
    public ResponseEntity<UsuarioResponse> getUsuarioById(@PathVariable Long usuarioId) {
        Optional<Usuario> result = usuarioService.getUsuarioById(usuarioId);
        return result.map(u -> ResponseEntity.ok(UsuarioResponse.fromEntity(u))).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UsuarioResponse> createUsuario(@RequestBody UsuarioRequest request) {
        Usuario result = usuarioService.createUsuario(request);
        return ResponseEntity.created(URI.create("/usuarios/" + result.getIdUsuario())).body(UsuarioResponse.fromEntity(result));
    }
}
