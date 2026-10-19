package com.uade.tpo.SeaPlace.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.SeaPlace.entity.Notificacion;
import com.uade.tpo.SeaPlace.entity.Usuario;
import com.uade.tpo.SeaPlace.repository.NotificacionRepository;

@Service
public class NotificacionServiceImpl implements NotificacionService {

    private static final int LARGO_MAXIMO = 1000;

    @Autowired
    private NotificacionRepository notificacionRepository;

    @Autowired
    private AutorizacionService autorizacionService;

    @Override
    public Notificacion notificar(Usuario destinatario, String texto) {
        Notificacion notificacion = new Notificacion();
        notificacion.setUsuario(destinatario);
        // El texto lo arma el sistema, pero puede llevar el motivo que escribio un administrador: se corta si no entra
        notificacion.setTexto(texto.length() > LARGO_MAXIMO ? texto.substring(0, LARGO_MAXIMO) : texto);
        notificacion.setFecha(LocalDateTime.now());
        return notificacionRepository.save(notificacion);
    }

    @Override
    public List<Notificacion> getMisNotificaciones() {
        return notificacionRepository.findByUsuario_IdUsuarioOrderByFechaDesc(autorizacionService.idUsuarioActual());
    }

    @Override
    public void marcarLeidas() {
        List<Notificacion> sinLeer = notificacionRepository.findByUsuario_IdUsuarioAndLeidaFalse(autorizacionService.idUsuarioActual());
        sinLeer.forEach(notificacion -> notificacion.setLeida(true));
        notificacionRepository.saveAll(sinLeer);
    }
}
