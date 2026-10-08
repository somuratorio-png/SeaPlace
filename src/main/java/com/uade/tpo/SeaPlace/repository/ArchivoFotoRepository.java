package com.uade.tpo.SeaPlace.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.SeaPlace.entity.ArchivoFoto;

@Repository
public interface ArchivoFotoRepository extends JpaRepository<ArchivoFoto, Long> {

    Optional<ArchivoFoto> findByFoto_IdFoto(Long idFoto);
}
