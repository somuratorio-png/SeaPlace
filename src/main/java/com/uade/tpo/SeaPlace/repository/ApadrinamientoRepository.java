package com.uade.tpo.SeaPlace.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.SeaPlace.entity.Apadrinamiento;

@Repository
public interface ApadrinamientoRepository extends JpaRepository<Apadrinamiento, Long> {

    List<Apadrinamiento> findByUsuario_IdUsuario(Long idUsuario);

    List<Apadrinamiento> findByAnimal_Refugio_IdRefugio(Long idRefugio);

    List<Apadrinamiento> findByAnimal_IdAnimalAndActivoTrue(Long idAnimal);

    Optional<Apadrinamiento> findByUsuario_IdUsuarioAndAnimal_IdAnimalAndActivoTrue(Long idUsuario, Long idAnimal);
}
