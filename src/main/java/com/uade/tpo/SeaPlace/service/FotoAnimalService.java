package com.uade.tpo.SeaPlace.service;

import java.util.List;

import com.uade.tpo.SeaPlace.entity.FotoAnimal;
import com.uade.tpo.SeaPlace.entity.dto.FotoAnimalRequest;

public interface FotoAnimalService {
    List<FotoAnimal> getFotosByAnimal(Long animalId);

    FotoAnimal createFoto(FotoAnimalRequest request);
}
