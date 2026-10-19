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

    // un administrador aprueba una publicacion PENDIENTE de un refugio: pasa a ACTIVA y aparece en el catalogo
    Animal aprobarAnimal(Long animalId);

    // un administrador rechaza una publicacion PENDIENTE: queda eliminada y el refugio recibe el aviso (con el motivo, si vino)
    void rechazarAnimal(Long animalId, String motivo);

    // los cambios que pidieron los refugios sobre publicaciones ya aprobadas (solo para un administrador)
    List<CambioPendienteResponse> getCambiosPendientes();

    // un administrador aplica los cambios que pidio el refugio; el refugio recibe un aviso
    Animal aprobarCambios(Long animalId);

    // un administrador los descarta (la publicacion queda como estaba); el refugio recibe el aviso con el motivo, si vino
    Animal rechazarCambios(Long animalId, String motivo);

    void deleteAnimal(Long animalId);
}