package com.uade.tpo.SeaPlace.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.SeaPlace.entity.Muelle;

@Repository
public interface MuelleRepository extends JpaRepository<Muelle, Long> {
    // carrito activo de un usuario
    Optional<Muelle> findByUsuario_IdUsuarioAndEstado(Long idUsuario, String estado);
}