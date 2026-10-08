package com.uade.tpo.SeaPlace.controllers;

import java.net.URI;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.SeaPlace.entity.Usuario;
import com.uade.tpo.SeaPlace.entity.dto.CambiarRolRequest;
import com.uade.tpo.SeaPlace.entity.dto.UsuarioRequest;
import com.uade.tpo.SeaPlace.entity.dto.UsuarioResponse;
import com.uade.tpo.SeaPlace.service.UsuarioService;
import com.uade.tpo.SeaPlace.entity.dto.UsuarioPerfilRequest;
import com.uade.tpo.SeaPlace.entity.dto.CambiarContraseniaRequest;

@RestController
@RequestMapping("usuarios")
public class UsuariosController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<Page<UsuarioResponse>> getUsuarios(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        Page<UsuarioResponse> resultado = usuarioService.getUsuarios(Paginacion.armar(page, size)).map(UsuarioResponse::fromEntity);
        // Si la pagina no trae elementos, se responde 204 (sin cuerpo) en vez de una pagina vacia.
        if (resultado.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(resultado);
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

    @PutMapping("/{usuarioId}/rol")
    public ResponseEntity<UsuarioResponse> cambiarRol(@PathVariable Long usuarioId, @RequestBody CambiarRolRequest request) {
        Usuario result = usuarioService.cambiarRol(usuarioId, request.getIdRol());
        return ResponseEntity.ok(UsuarioResponse.fromEntity(result));
    }

    @DeleteMapping("/{usuarioId}") //se llama darDeBaja porque no se elimina el usuario, solo se desactiva
    public ResponseEntity<UsuarioResponse> darDeBaja(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(UsuarioResponse.fromEntity(usuarioService.darDeBaja(usuarioId)));
    }

    // Un administrador reactiva una cuenta dada de baja (mientras este dentro del plazo).
    @PutMapping("/{usuarioId}/reactivar")
    public ResponseEntity<UsuarioResponse> reactivar(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(UsuarioResponse.fromEntity(usuarioService.reactivar(usuarioId)));
    }

    // Modifica los datos del usuario logueado (el del token). El nombre de usuario, el rol
    // y el estado de la cuenta no se pueden cambiar por esta ruta.
    @PutMapping("/me")
    public ResponseEntity<UsuarioResponse> modificarMiPerfil(@RequestBody UsuarioPerfilRequest request) {
        return ResponseEntity.ok(UsuarioResponse.fromEntity(usuarioService.modificarMiPerfil(request)));
    }

    // Datos del usuario logueado (el del token).
    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> getMiPerfil() {
        return ResponseEntity.ok(UsuarioResponse.fromEntity(usuarioService.getMiPerfil()));
    }

    // Cambia la contrasenia del usuario logueado (el del token); hay que mandar la actual.
    @PutMapping("/me/contrasenia")
    public ResponseEntity<Void> cambiarMiContrasenia(@RequestBody CambiarContraseniaRequest request) {
        usuarioService.cambiarMiContrasenia(request);
        return ResponseEntity.noContent().build();
    }
}