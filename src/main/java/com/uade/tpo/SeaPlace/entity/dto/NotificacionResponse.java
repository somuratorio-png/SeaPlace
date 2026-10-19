package com.uade.tpo.SeaPlace.entity.dto;

import java.time.LocalDateTime;

import com.uade.tpo.SeaPlace.entity.Notificacion;

import lombok.Data;

@Data
public class NotificacionResponse {
    private Long idNotificacion;
    private String texto;
    private LocalDateTime fecha;
    private boolean leida;

    public static NotificacionResponse fromEntity(Notificacion notificacion) {
        NotificacionResponse r = new NotificacionResponse();
        r.setIdNotificacion(notificacion.getIdNotificacion());
        r.setTexto(notificacion.getTexto());
        r.setFecha(notificacion.getFecha());
        r.setLeida(notificacion.isLeida());
        return r;
    }
}
