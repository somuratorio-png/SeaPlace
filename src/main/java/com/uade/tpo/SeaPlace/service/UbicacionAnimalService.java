package com.uade.tpo.SeaPlace.service;

import java.util.List;
import java.util.Optional;

import com.uade.tpo.SeaPlace.entity.UbicacionAnimal;
import com.uade.tpo.SeaPlace.entity.dto.UbicacionAnimalRequest;

public interface UbicacionAnimalService {
    List<UbicacionAnimal> getHistorial(Long animalId);

    Optional<UbicacionAnimal> getUltimaUbicacion(Long animalId);

    UbicacionAnimal registrarUbicacion(UbicacionAnimalRequest request);
}