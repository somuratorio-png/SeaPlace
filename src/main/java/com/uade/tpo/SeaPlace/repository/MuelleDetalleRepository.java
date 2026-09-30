// repository/CarritoDetalleRepository.java
package com.uade.tpo.SeaPlace.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.SeaPlace.entity.MuelleDetalle;

@Repository
public interface MuelleDetalleRepository extends JpaRepository<MuelleDetalle, Long> {
    List<MuelleDetalle> findByMuelle_IdMuelle(Long idMuelle);

    Optional<MuelleDetalle> findByMuelle_IdMuelleAndAnimal_IdAnimal(Long idMuelle, Long idAnimal);

    void deleteByMuelle_IdMuelleAndAnimal_IdAnimal(Long idMuelle, Long idAnimal);
}