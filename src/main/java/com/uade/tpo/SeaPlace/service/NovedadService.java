package com.uade.tpo.SeaPlace.service;

import java.util.List;

import com.uade.tpo.SeaPlace.entity.Novedad;
import com.uade.tpo.SeaPlace.entity.dto.NovedadRequest;

public interface NovedadService {

    List<Novedad> getNovedades(Long animalId);

    Novedad createNovedad(Long animalId, NovedadRequest request);
}
