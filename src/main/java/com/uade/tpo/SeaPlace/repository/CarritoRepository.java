// repository/CarritoRepository.java
package com.uade.tpo.SeaPlace.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.SeaPlace.entity.Carrito;

@Repository
public interface CarritoRepository extends JpaRepository<Carrito, Long> {
    // carrito activo de un usuario
    Optional<Carrito> findByUsuario_IdUsuarioAndEstado(Long idUsuario, String estado);
}