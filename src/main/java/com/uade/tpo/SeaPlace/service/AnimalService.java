package com.uade.tpo.SeaPlace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import com.uade.tpo.SeaPlace.entity.Animal;
import com.uade.tpo.SeaPlace.entity.dto.AnimalRequest;
import com.uade.tpo.SeaPlace.entity.dto.AnimalUpdateRequest;
import com.uade.tpo.SeaPlace.entity.dto.CambioPendienteResponse;

public interface AnimalService {
    Page<Animal> getAnimales(String estado, Long idCategoria, Long idRefugio, Double precioMin, Double precioMax, String nombre, PageRequest pageRequest);

    Optional<Animal> getAnimalById(Long animalId);

    Animal createAnimal(AnimalRequest request);

    Animal updateAnimal(Long animalId, AnimalUpdateRequest request);

    Animal aprobarAnimal(Long animalId);

    void rechazarAnimal(Long animalId, String motivo);

    List<CambioPendienteResponse> getCambiosPendientes();

    Animal aprobarCambios(Long animalId);

    Animal rechazarCambios(Long animalId, String motivo);

    void deleteAnimal(Long animalId);
}