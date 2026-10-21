package com.uade.tpo.SeaPlace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.SeaPlace.entity.Notificacion;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {

    List<Notificacion> findByUsuario_IdUsuarioOrderByFechaDesc(Long idUsuario);

    List<Notificacion> findByUsuario_IdUsuarioAndLeidaFalse(Long idUsuario);
}
