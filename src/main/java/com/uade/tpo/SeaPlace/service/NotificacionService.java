package com.uade.tpo.SeaPlace.service;

import java.util.List;

import com.uade.tpo.SeaPlace.entity.Animal;
import com.uade.tpo.SeaPlace.entity.Notificacion;
import com.uade.tpo.SeaPlace.entity.Usuario;

public interface NotificacionService {

    Notificacion notificar(Usuario destinatario, String texto);

    void notificarPadrinos(Animal animal, String texto);

    List<Notificacion> getMisNotificaciones();

    void marcarLeidas();
}
