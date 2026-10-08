package com.uade.tpo.SeaPlace.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.SeaPlace.entity.Favorito;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

    List<Favorito> findByUsuario_IdUsuario(Long idUsuario);

    Optional<Favorito> findByUsuario_IdUsuarioAndAnimal_IdAnimal(Long idUsuario, Long idAnimal);
}
