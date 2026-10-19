package com.uade.tpo.SeaPlace.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.SeaPlace.entity.dto.NotificacionResponse;
import com.uade.tpo.SeaPlace.service.NotificacionService;

// Los avisos de quien esta logueado (el del token): cada usuario ve solo los suyos.
@RestController
@RequestMapping("notificaciones")
public class NotificacionesController {

    @Autowired
    private NotificacionService notificacionService;

    // de la mas nueva a la mas vieja
    @GetMapping
    public ResponseEntity<List<NotificacionResponse>> getMisNotificaciones() {
        List<NotificacionResponse> resultado = notificacionService.getMisNotificaciones().stream().map(NotificacionResponse::fromEntity).toList();
        // Si no hay nada para devolver, se responde 204 (sin cuerpo) en vez de un array vacio.
        if (resultado.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(resultado);
    }

    // las marca todas como leidas (el front lo pide al abrir el apartado de notificaciones)
    @PutMapping("/leidas")
    public ResponseEntity<Void> marcarLeidas() {
        notificacionService.marcarLeidas();
        return ResponseEntity.noContent().build();
    }
}
