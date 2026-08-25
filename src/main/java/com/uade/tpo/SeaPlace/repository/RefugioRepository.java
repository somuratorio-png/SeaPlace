// repository/RefugioRepository.java
package com.uade.tpo.SeaPlace.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.SeaPlace.entity.Refugio;

@Repository
public interface RefugioRepository extends JpaRepository<Refugio, Long> {
    Optional<Refugio> findByUsuario_IdUsuario(Long idUsuario);

    Optional<Refugio> findByNombreRefugio(String nombreRefugio);
}