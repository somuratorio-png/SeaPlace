package com.uade.tpo.SeaPlace.controllers;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.SeaPlace.entity.Comentario;
import com.uade.tpo.SeaPlace.entity.dto.ComentarioRequest;
import com.uade.tpo.SeaPlace.entity.dto.ComentarioResponse;
import com.uade.tpo.SeaPlace.service.ComentarioService;

// Dos lugares para comentar: la pagina (/comentarios) y una novedad de la bitacora de un animal
// (/animales/{animalId}/novedades/{novedadId}/comentarios). Borrar es igual para los dos.
@RestController
public class ComentariosController {

    @Autowired
    private ComentarioService comentarioService;

    // los comentarios de la pagina, del mas nuevo al mas viejo (publico)
    @GetMapping("/comentarios")
    public ResponseEntity<List<ComentarioResponse>> getComentariosPagina() {
        return comoRespuesta(comentarioService.getComentariosPagina());
    }

    @PostMapping("/comentarios")
    public ResponseEntity<ComentarioResponse> comentarPagina(@RequestBody ComentarioRequest request) {
        Comentario result = comentarioService.comentarPagina(request);
        return ResponseEntity.created(URI.create("/comentarios/" + result.getIdComentario())).body(ComentarioResponse.fromEntity(result));
    }

    // la conversacion de una novedad, en el orden en que se escribio (solo sus padrinos, su refugio o un admin)
    @GetMapping("/animales/{animalId}/novedades/{novedadId}/comentarios")
    public ResponseEntity<List<ComentarioResponse>> getComentariosNovedad(@PathVariable Long animalId, @PathVariable Long novedadId) {
        return comoRespuesta(comentarioService.getComentariosNovedad(animalId, novedadId));
    }

    @PostMapping("/animales/{animalId}/novedades/{novedadId}/comentarios")
    public ResponseEntity<ComentarioResponse> comentarNovedad(@PathVariable Long animalId, @PathVariable Long novedadId,
            @RequestBody ComentarioRequest request) {
        Comentario result = comentarioService.comentarNovedad(animalId, novedadId, request);
        return ResponseEntity.created(URI.create("/comentarios/" + result.getIdComentario())).body(ComentarioResponse.fromEntity(result));
    }

    // solo quien lo escribio o un admin
    @DeleteMapping("/comentarios/{comentarioId}")
    public ResponseEntity<Void> deleteComentario(@PathVariable Long comentarioId) {
        comentarioService.deleteComentario(comentarioId);
        return ResponseEntity.noContent().build();
    }

    // Si no hay nada para devolver, se responde 204 (sin cuerpo) en vez de un array vacio.
    private ResponseEntity<List<ComentarioResponse>> comoRespuesta(List<Comentario> comentarios) {
        List<ComentarioResponse> resultado = comentarios.stream().map(ComentarioResponse::fromEntity).toList();
        if (resultado.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(resultado);
    }
}
