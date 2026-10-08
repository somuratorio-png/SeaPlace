package com.uade.tpo.SeaPlace.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.SeaPlace.entity.Apadrinamiento;

@Repository
public interface ApadrinamientoRepository extends JpaRepository<Apadrinamiento, Long> {

    // los apadrinamientos de un padrino (activos y cancelados)
    List<Apadrinamiento> findByUsuario_IdUsuario(Long idUsuario);

    // los de todos los animales de un refugio
    List<Apadrinamiento> findByAnimal_Refugio_IdRefugio(Long idRefugio);

    // el apadrinamiento vigente de un padrino para un animal (a lo sumo uno)
    Optional<Apadrinamiento> findByUsuario_IdUsuarioAndAnimal_IdAnimalAndActivoTrue(Long idUsuario, Long idAnimal);
}
