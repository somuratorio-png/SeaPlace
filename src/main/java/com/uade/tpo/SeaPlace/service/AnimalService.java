package com.uade.tpo.SeaPlace.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import com.uade.tpo.SeaPlace.entity.Animal;
import com.uade.tpo.SeaPlace.entity.dto.AnimalRequest;
import com.uade.tpo.SeaPlace.entity.dto.AnimalUpdateRequest;

public interface AnimalService {
    Page<Animal> getAnimales(String estado, PageRequest pageRequest);

    Optional<Animal> getAnimalById(Long animalId);

    Animal createAnimal(AnimalRequest request);

    Animal updateAnimal(Long animalId, AnimalUpdateRequest request);

    void deleteAnimal(Long animalId);
}