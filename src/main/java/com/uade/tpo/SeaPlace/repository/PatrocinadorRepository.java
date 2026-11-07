package com.uade.tpo.SeaPlace.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.SeaPlace.entity.Patrocinador;

@Repository
public interface PatrocinadorRepository extends JpaRepository<Patrocinador, Long> {

    // el patrocinador de una cuenta (a lo sumo uno)
    Optional<Patrocinador> findByUsuario_IdUsuario(Long idUsuario);

    boolean existsByNombreEmpresaIgnoreCase(String nombreEmpresa);
}
