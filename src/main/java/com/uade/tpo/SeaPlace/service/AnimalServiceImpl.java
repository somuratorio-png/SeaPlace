package com.uade.tpo.SeaPlace.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.uade.tpo.SeaPlace.entity.Animal;
import com.uade.tpo.SeaPlace.entity.Categoria;
import com.uade.tpo.SeaPlace.entity.Refugio;
import com.uade.tpo.SeaPlace.entity.dto.AnimalRequest;
import com.uade.tpo.SeaPlace.exceptions.RecursoNoEncontradoException;
import com.uade.tpo.SeaPlace.exceptions.ReglaDeNegocioException;
import com.uade.tpo.SeaPlace.repository.AnimalRepository;
import com.uade.tpo.SeaPlace.repository.CategoriaRepository;
import com.uade.tpo.SeaPlace.repository.RefugioRepository;

@Service
public class AnimalServiceImpl implements AnimalService {

    private static final String ESTADO_PUBLICACION_ACTIVA = "ACTIVA";

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private RefugioRepository refugioRepository;

    @Override
    public Page<Animal> getAnimales(String estado, PageRequest pageRequest) {
        if (estado == null || estado.isBlank()) {
            return animalRepository.findAll(pageRequest);
        }
        return animalRepository.findByEstado(estado, pageRequest);
    }

    @Override
    public Optional<Animal> getAnimalById(Long animalId) {
        return animalRepository.findById(animalId);
    }

    @Override
    public Animal createAnimal(AnimalRequest request) {
        Categoria categoria = categoriaRepository.findById(request.getIdCategoria())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe la categoria con id " + request.getIdCategoria()));

        Refugio refugio = refugioRepository.findById(request.getIdRefugio())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el refugio con id " + request.getIdRefugio()));

        if (request.getCuposTotales() == null || request.getCuposTotales() <= 0) {
            throw new ReglaDeNegocioException("Los cupos totales deben ser un numero mayor a 0");
        }

        if (request.getCuotaApadrinamiento() == null || request.getCuotaApadrinamiento() <= 0) {
            throw new ReglaDeNegocioException("La cuota de apadrinamiento debe ser un monto mayor a 0");
        }

        Animal animal = new Animal();
        animal.setCategoria(categoria);
        animal.setRefugio(refugio);
        animal.setNombreAnimal(request.getNombreAnimal());
        animal.setDescripcion(request.getDescripcion());
        animal.setCuotaApadrinamiento(request.getCuotaApadrinamiento());
        animal.setCuposTotales(request.getCuposTotales());

        // Al publicar, ningun padrino ocupo lugar todavia: todos los cupos estan libres.
        animal.setCuposDisponibles(request.getCuposTotales());

        // Una publicacion nace activa para aparecer en el catalogo desde el primer momento.
        animal.setEstado(ESTADO_PUBLICACION_ACTIVA);
        animal.setFechaPublicacion(LocalDateTime.now());

        return animalRepository.save(animal);
    }
}
