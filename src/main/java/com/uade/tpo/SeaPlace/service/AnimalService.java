package com.uade.tpo.SeaPlace.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import com.uade.tpo.SeaPlace.entity.Animal;
import com.uade.tpo.SeaPlace.entity.dto.AnimalRequest;
import com.uade.tpo.SeaPlace.entity.dto.AnimalUpdateRequest;

public interface AnimalService {
    Page<Animal> getAnimales(String estado, Long idCategoria, Long idRefugio, Double precioMin, Double precioMax, String nombre, PageRequest pageRequest);

    Optional<Animal> getAnimalById(Long animalId);

    Animal createAnimal(AnimalRequest request);

    Animal updateAnimal(Long animalId, AnimalUpdateRequest request);

    // un administrador aprueba una publicacion PENDIENTE de un refugio: pasa a ACTIVA y aparece en el catalogo
    Animal aprobarAnimal(Long animalId);

    // un administrador rechaza una publicacion PENDIENTE: queda eliminada y el refugio recibe el aviso (con el motivo, si vino)
    void rechazarAnimal(Long animalId, String motivo);

    void deleteAnimal(Long animalId);
}