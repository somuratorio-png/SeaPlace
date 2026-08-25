// repository/FotoAnimalRepository.java
package com.uade.tpo.SeaPlace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.SeaPlace.entity.FotoAnimal;

@Repository
public interface FotoAnimalRepository extends JpaRepository<FotoAnimal, Long> {
    List<FotoAnimal> findByAnimal_IdAnimalOrderByOrdenAsc(Long idAnimal);
}
