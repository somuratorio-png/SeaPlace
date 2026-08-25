package com.uade.tpo.SeaPlace.service;

import java.util.List;

import com.uade.tpo.SeaPlace.entity.Descuento;
import com.uade.tpo.SeaPlace.entity.dto.DescuentoRequest;

public interface DescuentoService {
    List<Descuento> getDescuentosActivos(Long animalId);

    Descuento createDescuento(DescuentoRequest request);
}
