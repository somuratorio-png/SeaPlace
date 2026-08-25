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
import com.uade.tpo.SeaPlace.service.UsuarioService;

@RestController
@RequestMapping("usuarios")
public class UsuariosController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<Page<Usuario>> getUsuarios(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        if (page == null || size == null)
            return ResponseEntity.ok(usuarioService.getUsuarios(PageRequest.of(0, Integer.MAX_VALUE)));
        return ResponseEntity.ok(usuarioService.getUsuarios(PageRequest.of(page, size)));
    }

    @GetMapping("/{usuarioId}")
    public ResponseEntity<Usuario> getUsuarioById(@PathVariable Long usuarioId) {
        Optional<Usuario> result = usuarioService.getUsuarioById(usuarioId);
        return result.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Usuario> createUsuario(@RequestBody UsuarioRequest request) {
        Usuario result = usuarioService.createUsuario(request);
        return ResponseEntity.created(URI.create("/usuarios/" + result.getIdUsuario())).body(result);
    }
}