// repository/UbicacionAnimalRepository.java
package com.uade.tpo.SeaPlace.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.SeaPlace.entity.UbicacionAnimal;

@Repository
public interface UbicacionAnimalRepository extends JpaRepository<UbicacionAnimal, Long> {
    List<UbicacionAnimal> findByAnimal_IdAnimalOrderByFechaHoraDesc(Long idAnimal);

    // última ubicación conocida del animal
    Optional<UbicacionAnimal> findTopByAnimal_IdAnimalOrderByFechaHoraDesc(Long idAnimal);
}