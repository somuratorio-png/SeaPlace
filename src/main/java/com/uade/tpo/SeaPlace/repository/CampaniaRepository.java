package com.uade.tpo.SeaPlace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.SeaPlace.entity.Campania;

@Repository
public interface CampaniaRepository extends JpaRepository<Campania, Long> {

    // las campañas de un patrocinador, de la mas nueva a la mas vieja
    List<Campania> findByPatrocinador_IdPatrocinadorOrderByFechaInicioDescIdCampaniaDesc(Long idPatrocinador);

    // todas las de un patrocinador (para calcular su nivel y su impacto)
    List<Campania> findByPatrocinador_IdPatrocinador(Long idPatrocinador);

    // las que siguen activas para un animal (de ahi sale la vigente, si hay)
    List<Campania> findByAnimal_IdAnimalAndActivaTrue(Long idAnimal);
}
