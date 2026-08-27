package com.uade.tpo.SeaPlace.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.uade.tpo.SeaPlace.entity.Animal;
import com.uade.tpo.SeaPlace.entity.Categoria;
import com.uade.tpo.SeaPlace.entity.Refugio;
import com.uade.tpo.SeaPlace.entity.Usuario;
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
    public Page<Animal> getAnimales(String estado, Long idCategoria, Double precioMin, Double precioMax, PageRequest pageRequest) {
        String estadoFiltro = estado;
        if ((estadoFiltro == null || estadoFiltro.isBlank()) && (idCategoria != null || precioMin != null || precioMax != null)) {
            estadoFiltro = ESTADO_PUBLICACION_ACTIVA;
        }

        if (idCategoria != null) {
            return animalRepository.findByEstadoAndCategoria_IdCategoria(estadoFiltro, idCategoria, pageRequest);
        }

        if (precioMin != null || precioMax != null) {
            double min = precioMin != null ? precioMin : 0;
            double max = precioMax != null ? precioMax : Double.MAX_VALUE;
            return animalRepository.findByEstadoAndCuotaApadrinamientoBetween(estadoFiltro, min, max, pageRequest);
        }

        if (estadoFiltro == null || estadoFiltro.isBlank()) {
            return animalRepository.findAll(pageRequest);
        }
        return animalRepository.findByEstado(estadoFiltro, pageRequest);
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

        validarPermisoSobreRefugio(refugio.getIdRefugio());

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
        animal.setCuposDisponibles(request.getCuposTotales());
        animal.setEstado(ESTADO_PUBLICACION_ACTIVA);
        animal.setFechaPublicacion(LocalDateTime.now());

        return animalRepository.save(animal);
    }

    @Override
    public Animal updateAnimal(Long animalId, AnimalUpdateRequest request) {
        Animal animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el animal con id " + animalId));

        validarPermisoSobreRefugio(animal.getRefugio().getIdRefugio());

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

        validarPermisoSobreRefugio(animal.getRefugio().getIdRefugio());

        if (ESTADO_PUBLICACION_ELIMINADA.equals(animal.getEstado())) {
            throw new ReglaDeNegocioException("La publicacion ya fue eliminada");
        }

        animal.setEstado(ESTADO_PUBLICACION_ELIMINADA);
        animalRepository.save(animal);
    }

    // Un ADMINISTRADOR puede gestionar cualquier animal. Un refugio (no admin) solo puede
    // gestionar los animales de su propio refugio, segun el vinculo 1 a 1 Usuario-Refugio.
    private void validarPermisoSobreRefugio(Long idRefugio) {
        Usuario usuarioActual = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        boolean esAdmin = usuarioActual.getRol().getNombreRol().equalsIgnoreCase("administrador");
        if (esAdmin) {
            return;
        }

        Refugio refugioPropio = usuarioActual.getRefugio();
        if (refugioPropio == null || !refugioPropio.getIdRefugio().equals(idRefugio)) {
            throw new AccessDeniedException("No tenes permiso para gestionar animales de este refugio");
        }
    }
}