package com.uade.tpo.SeaPlace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.SeaPlace.entity.Comentario;

@Repository
public interface ComentarioRepository extends JpaRepository<Comentario, Long> {

    // los comentarios sobre la pagina (los que no son de ninguna novedad), del mas nuevo al mas viejo
    List<Comentario> findByNovedadIsNullOrderByFechaDesc();

    // la conversacion de una novedad, en el orden en que se escribio
    List<Comentario> findByNovedad_IdNovedadOrderByFechaAsc(Long idNovedad);
}
