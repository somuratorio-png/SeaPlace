package com.uade.tpo.SeaPlace.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.SeaPlace.entity.dto.NotificacionResponse;
import com.uade.tpo.SeaPlace.service.NotificacionService;

@RestController
@RequestMapping("notificaciones")
public class NotificacionesController {

    @Autowired
    private NotificacionService notificacionService;

    @GetMapping
    public ResponseEntity<List<NotificacionResponse>> getMisNotificaciones() {
        List<NotificacionResponse> resultado = notificacionService.getMisNotificaciones().stream().map(NotificacionResponse::fromEntity).toList();
        if (resultado.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(resultado);
    }

    @PutMapping("/leidas")
    public ResponseEntity<Void> marcarLeidas() {
        notificacionService.marcarLeidas();
        return ResponseEntity.noContent().build();
    }
}
