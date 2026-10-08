package com.uade.tpo.SeaPlace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.SeaPlace.entity.Novedad;

@Repository
public interface NovedadRepository extends JpaRepository<Novedad, Long> {

    // la bitacora de un animal, de la novedad mas nueva a la mas vieja
    List<Novedad> findByAnimal_IdAnimalOrderByFechaDesc(Long idAnimal);
}
