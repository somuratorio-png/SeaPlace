package com.uade.tpo.SeaPlace.service;

import java.util.List;

import com.uade.tpo.SeaPlace.entity.Notificacion;
import com.uade.tpo.SeaPlace.entity.Usuario;

public interface NotificacionService {

    // Le deja un aviso a un usuario. La usan otros services (por ejemplo, al aprobar o rechazar una publicacion).
    Notificacion notificar(Usuario destinatario, String texto);

    // las de quien esta logueado, de la mas nueva a la mas vieja
    List<Notificacion> getMisNotificaciones();

    // marca como leidas todas las de quien esta logueado
    void marcarLeidas();
}
