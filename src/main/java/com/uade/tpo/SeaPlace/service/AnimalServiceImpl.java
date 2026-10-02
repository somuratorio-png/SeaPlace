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
import org.springframework.security.access.AccessDeniedException;
import com.uade.tpo.SeaPlace.entity.Usuario;

@Service
public class AnimalServiceImpl implements AnimalService {

    private static final String ESTADO_PUBLICACION_ACTIVA = "ACTIVA";
    private static final String ESTADO_PUBLICACION_PAUSADA = "PAUSADA";
    private static final String ESTADO_PUBLICACION_ELIMINADA = "ELIMINADA";

    private static final int LARGO_MAXIMO = 255;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private RefugioRepository refugioRepository;

    @Autowired
    private AutorizacionService autorizacionService;

    @Override
    public Page<Animal> getAnimales(String estado, Long idCategoria, Long idRefugio, Double precioMin, Double precioMax,
                                    String nombre, PageRequest pageRequest) {
        // Sin estado explicito, el catalogo muestra solo las publicaciones ACTIVAS.
        String estadoFiltro = (estado == null || estado.isBlank())
                ? ESTADO_PUBLICACION_ACTIVA
                : estado.trim().toUpperCase();

        if (!ESTADO_PUBLICACION_ACTIVA.equals(estadoFiltro)
                && !ESTADO_PUBLICACION_PAUSADA.equals(estadoFiltro)
                && !ESTADO_PUBLICACION_ELIMINADA.equals(estadoFiltro)) {
            throw new ReglaDeNegocioException("Estado invalido: ACTIVA, PAUSADA o ELIMINADA");
        }

        // Solo las ACTIVAS son publicas. Las demas las ve un admin (todas) o el dueño de un
        // refugio (solo sus PAUSADAS); para el resto es un 403.
        Long idRefugioFiltro = idRefugio;
        if (!ESTADO_PUBLICACION_ACTIVA.equals(estadoFiltro)) {
            Usuario actual = autorizacionService.usuarioActualONull();
            boolean esAdmin = actual != null && autorizacionService.esAdmin();
            boolean duenoConPausadas = actual != null && actual.getRefugio() != null
                    && ESTADO_PUBLICACION_PAUSADA.equals(estadoFiltro);

            if (!esAdmin && !duenoConPausadas) {
                throw new AccessDeniedException("No tenes permiso para ver publicaciones " + estadoFiltro);
            }
            if (!esAdmin) {
                idRefugioFiltro = actual.getRefugio().getIdRefugio();
            }
        }

        if ((precioMin != null && precioMin < 0) || (precioMax != null && precioMax < 0)) {
            throw new ReglaDeNegocioException("Los precios no pueden ser negativos");
        }
        if (precioMin != null && precioMax != null && precioMin > precioMax) {
            throw new ReglaDeNegocioException("El precio minimo no puede ser mayor al precio maximo");
        }

        String nombreFiltro = (nombre == null) ? "" : nombre.trim();

        return animalRepository.buscar(estadoFiltro, idCategoria, idRefugioFiltro,
                precioMin, precioMax, nombreFiltro, pageRequest);
    }

    @Override
    public Optional<Animal> getAnimalById(Long animalId) {
        // Una publicacion no ACTIVA solo la ve un admin o el dueño de su refugio (si esta PAUSADA);
        // para el resto es como si no existiera (404).
        return animalRepository.findById(animalId).filter(autorizacionService::puedeVerAnimal);
    }

    @Override
    public Animal createAnimal(AnimalRequest request) {
        if (request.getIdCategoria() == null) {
            throw new ReglaDeNegocioException("El campo 'idCategoria' es obligatorio");
        }

        Long idRefugio = resolverIdRefugio(request.getIdRefugio());

        String nombreAnimal = request.getNombreAnimal() == null ? "" : request.getNombreAnimal().trim();
        if (nombreAnimal.isEmpty()) {
            throw new ReglaDeNegocioException("El nombre del animal es obligatorio");
        }
        if (nombreAnimal.length() > LARGO_MAXIMO) {
            throw new ReglaDeNegocioException(
                    "El nombre del animal no puede superar los " + LARGO_MAXIMO + " caracteres");
        }

        Categoria categoria = categoriaRepository.findById(request.getIdCategoria())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe la categoria con id " + request.getIdCategoria()));

        Refugio refugio = refugioRepository.findById(idRefugio)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el refugio con id " + idRefugio));

        autorizacionService.validarPermisoSobreRefugio(refugio.getIdRefugio());

        if (request.getCuposTotales() == null || request.getCuposTotales() <= 0) {
            throw new ReglaDeNegocioException("Los cupos totales deben ser un numero mayor a 0");
        }

        if (request.getCuotaApadrinamiento() == null || request.getCuotaApadrinamiento() <= 0) {
            throw new ReglaDeNegocioException("La cuota de apadrinamiento debe ser un monto mayor a 0");
        }

        Animal animal = new Animal();
        animal.setCategoria(categoria);
        animal.setRefugio(refugio);
        animal.setNombreAnimal(nombreAnimal);
        animal.setDescripcion(request.getDescripcion());
        animal.setCuotaApadrinamiento(request.getCuotaApadrinamiento());
        animal.setCuposTotales(request.getCuposTotales());
        animal.setCuposDisponibles(request.getCuposTotales());
        animal.setEstado(ESTADO_PUBLICACION_ACTIVA);
        animal.setFechaPublicacion(LocalDateTime.now());

        return animalRepository.save(animal);
    }

    // Un dueño de refugio no manda idRefugio: se usa el de su cuenta (el del token).
    // Un admin, que no tiene refugio propio, tiene que indicar para cuál publica.
    private Long resolverIdRefugio(Long idRefugioPedido) {
        if (idRefugioPedido != null) {
            return idRefugioPedido;
        }
        Refugio refugioPropio = autorizacionService.usuarioActual().getRefugio();
        if (refugioPropio == null) {
            throw new ReglaDeNegocioException("El campo 'idRefugio' es obligatorio");
        }
        return refugioPropio.getIdRefugio();
    }

    @Override
    public Animal updateAnimal(Long animalId, AnimalUpdateRequest request) {
        Animal animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el animal con id " + animalId));

        autorizacionService.validarPermisoSobreRefugio(animal.getRefugio().getIdRefugio());

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

        autorizacionService.validarPermisoSobreRefugio(animal.getRefugio().getIdRefugio());

        if (ESTADO_PUBLICACION_ELIMINADA.equals(animal.getEstado())) {
            throw new ReglaDeNegocioException("La publicacion ya fue eliminada");
        }

        animal.setEstado(ESTADO_PUBLICACION_ELIMINADA);
        animalRepository.save(animal);
    }
}