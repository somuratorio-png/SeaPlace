package com.uade.tpo.SeaPlace.service;

import java.util.List;

import com.uade.tpo.SeaPlace.entity.Muelle;
import com.uade.tpo.SeaPlace.entity.MuelleDetalle;
import com.uade.tpo.SeaPlace.entity.dto.MuelleDetalleRequest;

public interface MuelleService {
    Muelle getOrCreateMuelleActivo(Long idUsuario);

    MuelleDetalle agregarItem(MuelleDetalleRequest request);

    MuelleDetalle modificarCantidad(Long muelleId, Long animalId, Integer cantidad, String plan);

    void quitarItem(Long muelleId, Long animalId);

    List<MuelleDetalle> getItems(Long muelleId);
}
