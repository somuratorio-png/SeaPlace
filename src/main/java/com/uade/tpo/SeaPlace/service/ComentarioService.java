package com.uade.tpo.SeaPlace.service;

import java.util.List;

import com.uade.tpo.SeaPlace.entity.Comentario;
import com.uade.tpo.SeaPlace.entity.dto.ComentarioRequest;

public interface ComentarioService {

    List<Comentario> getComentariosPagina();

    Comentario comentarPagina(ComentarioRequest request);

    List<Comentario> getComentariosNovedad(Long animalId, Long novedadId);

    Comentario comentarNovedad(Long animalId, Long novedadId, ComentarioRequest request);

    void deleteComentario(Long comentarioId);
}
