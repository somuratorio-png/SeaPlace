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
import com.uade.tpo.SeaPlace.entity.dto.AnimalUpdateRequest;
import com.uade.tpo.SeaPlace.exceptions.RecursoNoEncontradoException;
import com.uade.tpo.SeaPlace.exceptions.ReglaDeNegocioException;
import com.uade.tpo.SeaPlace.repository.AnimalRepository;
import com.uade.tpo.SeaPlace.repository.CategoriaRepository;
import com.uade.tpo.SeaPlace.repository.RefugioRepository;

@Service
public class AnimalServiceImpl implements AnimalService {

    private static final String ESTADO_PUBLICACION_ACTIVA = "ACTIVA";
    private static final String ESTADO_PUBLICACION_PAUSADA = "PAUSADA";
    private static final String ESTADO_PUBLICACION_ELIMINADA = "ELIMINADA";

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

    @Override
    public Animal updateAnimal(Long animalId, AnimalUpdateRequest request) {
        Animal animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el animal con id " + animalId));

        if (ESTADO_PUBLICACION_ELIMINADA.equals(animal.getEstado())) {
            throw new ReglaDeNegocioException("No se puede modificar una publicacion eliminada");
        }

        if (request.getNombreAnimal() != null) {
            if (request.getNombreAnimal().isBlank()) {
                throw new ReglaDeNegocioException("El nombre del animal no puede estar vacio");
            }
            animal.setNombreAnimal(request.getNombreAnimal());
        }

        if (request.getDescripcion() != null) {
            animal.setDescripcion(request.getDescripcion());
        }

        if (request.getCuotaApadrinamiento() != null) {
            if (request.getCuotaApadrinamiento() <= 0) {
                throw new ReglaDeNegocioException("La cuota de apadrinamiento debe ser un monto mayor a 0");
            }
            animal.setCuotaApadrinamiento(request.getCuotaApadrinamiento());
        }

        if (request.getEstado() != null) {
            // La eliminacion tiene su propio endpoint (DELETE), no se elimina por update.
            if (!ESTADO_PUBLICACION_ACTIVA.equals(request.getEstado())
                    && !ESTADO_PUBLICACION_PAUSADA.equals(request.getEstado())) {
                throw new ReglaDeNegocioException("Estado invalido: solo ACTIVA o PAUSADA");
            }
            animal.setEstado(request.getEstado());
        }

        if (request.getCuposTotales() != null) {
            if (request.getCuposTotales() <= 0) {
                throw new ReglaDeNegocioException("Los cupos totales deben ser un numero mayor a 0");
            }

            // Manejo del stock: los cupos ocupados son los padrinos que ya apadrinaron
            // (total - disponibles). El refugio puede cambiar el total, pero nunca por debajo de
            // los ocupados, porque esos padrinos ya pagaron su lugar. Los disponibles se ajustan
            // para mantener los ocupados. Ejemplo: total 10 con 3 disponibles = 7 ocupados; si el
            // refugio sube el total a 12, disponibles pasa a 5.
            int cuposOcupados = animal.getCuposTotales() - animal.getCuposDisponibles();
            if (request.getCuposTotales() < cuposOcupados) {
                throw new ReglaDeNegocioException(
                        "No se pueden reducir los cupos totales a " + request.getCuposTotales()
                                + ": ya hay " + cuposOcupados + " cupos ocupados por padrinos");
            }
            animal.setCuposDisponibles(request.getCuposTotales() - cuposOcupados);
            animal.setCuposTotales(request.getCuposTotales());
        }

        return animalRepository.save(animal);
    }

    @Override
    public void deleteAnimal(Long animalId) {
        Animal animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el animal con id " + animalId));

        if (ESTADO_PUBLICACION_ELIMINADA.equals(animal.getEstado())) {
            throw new ReglaDeNegocioException("La publicacion ya fue eliminada");
        }

        // Borrado logico: no se borra la fila porque las compras historicas referencian al animal;
        // se marca ELIMINADA y el catalogo deja de mostrarla.
        animal.setEstado(ESTADO_PUBLICACION_ELIMINADA);
        animalRepository.save(animal);
    }
}
