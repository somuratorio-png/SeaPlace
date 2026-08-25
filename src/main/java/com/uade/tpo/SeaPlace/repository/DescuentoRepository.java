// repository/DescuentoRepository.java
package com.uade.tpo.SeaPlace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.SeaPlace.entity.Descuento;

@Repository
public interface DescuentoRepository extends JpaRepository<Descuento, Long> {
    List<Descuento> findByAnimal_IdAnimalAndActivoTrue(Long idAnimal);
}