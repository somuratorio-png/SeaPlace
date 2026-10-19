package com.uade.tpo.SeaPlace.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.uade.tpo.SeaPlace.entity.Animal;
import com.uade.tpo.SeaPlace.entity.Categoria;
import com.uade.tpo.SeaPlace.entity.Plan;
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
    // Lo que publica un refugio queda asi hasta que un administrador lo aprueba: no se ve en el catalogo.
    private static final String ESTADO_PUBLICACION_PENDIENTE = "PENDIENTE";

    private static final int LARGO_MAXIMO = 255;

    private static final List<String> URGENCIAS = List.of("CRITICO", "RECUPERACION", "LISTO");
    private static final String URGENCIA_POR_DEFECTO = "RECUPERACION";

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private RefugioRepository refugioRepository;

    @Autowired
    private AutorizacionService autorizacionService;

    @Autowired
    private NotificacionService notificacionService;

    @Override
    public Page<Animal> getAnimales(String estado, Long idCategoria, Long idRefugio, Double precioMin, Double precioMax,
                                    String nombre, PageRequest pageRequest) {
        // Sin estado explicito, el catalogo muestra solo las publicaciones ACTIVAS.
        String estadoFiltro = (estado == null || estado.isBlank())
                ? ESTADO_PUBLICACION_ACTIVA
                : estado.trim().toUpperCase();

        if (!ESTADO_PUBLICACION_ACTIVA.equals(estadoFiltro)
                && !ESTADO_PUBLICACION_PAUSADA.equals(estadoFiltro)
                && !ESTADO_PUBLICACION_PENDIENTE.equals(estadoFiltro)
                && !ESTADO_PUBLICACION_ELIMINADA.equals(estadoFiltro)) {
            throw new ReglaDeNegocioException("Estado invalido: ACTIVA, PAUSADA, PENDIENTE o ELIMINADA");
        }

        // Solo las ACTIVAS son publicas. Las demas las ve un admin (todas) o el dueño de un
        // refugio (solo sus PAUSADAS y PENDIENTES); para el resto es un 403.
        Long idRefugioFiltro = idRefugio;
        if (!ESTADO_PUBLICACION_ACTIVA.equals(estadoFiltro)) {
            Usuario actual = autorizacionService.usuarioActualONull();
            boolean esAdmin = actual != null && autorizacionService.esAdmin();
            boolean duenoConPropias = actual != null && actual.getRefugio() != null
                    && (ESTADO_PUBLICACION_PAUSADA.equals(estadoFiltro)
                            || ESTADO_PUBLICACION_PENDIENTE.equals(estadoFiltro));

            if (!esAdmin && !duenoConPropias) {
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
        // Una publicacion no ACTIVA solo la ve un admin o el dueño de su refugio (si esta PAUSADA o PENDIENTE);
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

        // Un refugio que se registro solo no publica hasta que un administrador lo aprueba.
        if (!refugio.isAprobado()) {
            throw new ReglaDeNegocioException("El refugio todavia no fue aprobado por un administrador");
        }

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
        animal.setPrecioBrisaMarina(precioOpcional(request.getPrecioBrisaMarina(), "Brisa Marina"));
        animal.setPrecioMareaProfunda(precioOpcional(request.getPrecioMareaProfunda(), "Marea Profunda"));
        validarOrdenDePrecios(animal);
        animal.setCuposTotales(request.getCuposTotales());
        animal.setCuposDisponibles(request.getCuposTotales());
        // Lo que publica un refugio espera la aprobacion de un administrador; lo que publica un admin sale directo.
        animal.setEstado(autorizacionService.esAdmin() ? ESTADO_PUBLICACION_ACTIVA : ESTADO_PUBLICACION_PENDIENTE);
        animal.setFechaPublicacion(LocalDateTime.now());

        String urgencia = urgenciaValida(request.getUrgencia());
        animal.setEspecie(textoOpcional(request.getEspecie(), "especie"));
        animal.setEdad(textoOpcional(request.getEdad(), "edad"));
        animal.setUbicacion(textoOpcional(request.getUbicacion(), "ubicacion"));
        animal.setUrgencia(urgencia == null ? URGENCIA_POR_DEFECTO : urgencia);
        animal.setCondicion(textoOpcional(request.getCondicion(), "condicion"));

        return animalRepository.save(animal);
    }

    // El precio de un plan que puede no venir (entonces se usa el multiplicador del plan). Si viene, tiene que ser mayor a 0.
    private Double precioOpcional(Double precio, String plan) {
        if (precio != null && precio <= 0) {
            throw new ReglaDeNegocioException("El precio del plan " + plan + " debe ser un monto mayor a 0");
        }
        return precio;
    }

    // Cada plan incluye lo del anterior, asi que tiene que costar mas: Brisa Marina < Guardian de la Bahia < Marea Profunda.
    private void validarOrdenDePrecios(Animal animal) {
        double brisa = animal.precioDelPlan(Plan.BRISA_MARINA);
        double guardian = animal.precioDelPlan(Plan.GUARDIAN_DE_LA_BAHIA);
        double marea = animal.precioDelPlan(Plan.MAREA_PROFUNDA);
        if (brisa >= guardian || guardian >= marea) {
            throw new ReglaDeNegocioException(
                    "Cada plan tiene que costar mas que el anterior: Brisa Marina < Guardian de la Bahia < Marea Profunda");
        }
    }

    // Recorta un texto opcional de la ficha. Vacio se guarda como null; corta si no entra en la columna.
    private String textoOpcional(String valor, String campo) {
        if (valor == null || valor.isBlank()) {
            return null;
        }
        String limpio = valor.trim();
        if (limpio.length() > LARGO_MAXIMO) {
            throw new ReglaDeNegocioException(
                    "El campo '" + campo + "' no puede superar los " + LARGO_MAXIMO + " caracteres");
        }
        return limpio;
    }

    // Devuelve la urgencia en mayusculas, o null si no vino. Corta si no es una de las validas.
    private String urgenciaValida(String valor) {
        if (valor == null || valor.isBlank()) {
            return null;
        }
        String urgencia = valor.trim().toUpperCase();
        if (!URGENCIAS.contains(urgencia)) {
            throw new ReglaDeNegocioException("Urgencia invalida: CRITICO, RECUPERACION o LISTO");
        }
        return urgencia;
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
        if (request.getPrecioBrisaMarina() != null) {
            animal.setPrecioBrisaMarina(precioOpcional(request.getPrecioBrisaMarina(), "Brisa Marina"));
        }
        if (request.getPrecioMareaProfunda() != null) {
            animal.setPrecioMareaProfunda(precioOpcional(request.getPrecioMareaProfunda(), "Marea Profunda"));
        }
        validarOrdenDePrecios(animal);

        if (request.getEstado() != null) {
            // Una pendiente no se activa ni se pausa desde aca: la aprueba un administrador (aprobarAnimal)
            if (ESTADO_PUBLICACION_PENDIENTE.equals(animal.getEstado())) {
                throw new ReglaDeNegocioException("La publicacion todavia no fue aprobada por un administrador");
            }
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

        // Datos de la ficha: igual que el resto, solo se cambia lo que viene informado.
        if (request.getEspecie() != null) {
            animal.setEspecie(textoOpcional(request.getEspecie(), "especie"));
        }
        if (request.getEdad() != null) {
            animal.setEdad(textoOpcional(request.getEdad(), "edad"));
        }
        if (request.getUbicacion() != null) {
            animal.setUbicacion(textoOpcional(request.getUbicacion(), "ubicacion"));
        }
        if (request.getCondicion() != null) {
            animal.setCondicion(textoOpcional(request.getCondicion(), "condicion"));
        }
        String urgencia = urgenciaValida(request.getUrgencia());
        if (urgencia != null) {
            animal.setUrgencia(urgencia);
        }

        // Que animales se destacan en el inicio lo decide un administrador, no cada refugio.
        if (request.getDestacado() != null) {
            if (!autorizacionService.esAdmin()) {
                throw new AccessDeniedException("Solo un administrador puede destacar un animal");
            }
            animal.setDestacado(request.getDestacado());
        }

        return animalRepository.save(animal);
    }

    @Override
    public Animal aprobarAnimal(Long animalId) {
        if (!autorizacionService.esAdmin()) {
            throw new AccessDeniedException("Solo un administrador puede aprobar una publicacion");
        }
        Animal animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el animal con id " + animalId));
        if (!ESTADO_PUBLICACION_PENDIENTE.equals(animal.getEstado())) {
            throw new ReglaDeNegocioException("La publicacion no esta pendiente de aprobacion");
        }
        animal.setEstado(ESTADO_PUBLICACION_ACTIVA);
        Animal aprobado = animalRepository.save(animal);
        avisarAlRefugio(animal, "Aprobamos la publicación de " + animal.getNombreAnimal() + ": ya aparece en el catálogo.");
        return aprobado;
    }

    @Override
    public void rechazarAnimal(Long animalId, String motivo) {
        if (!autorizacionService.esAdmin()) {
            throw new AccessDeniedException("Solo un administrador puede rechazar una publicacion");
        }
        Animal animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el animal con id " + animalId));
        if (!ESTADO_PUBLICACION_PENDIENTE.equals(animal.getEstado())) {
            throw new ReglaDeNegocioException("La publicacion no esta pendiente de aprobacion");
        }
        // No se borra de la base: queda eliminada, igual que cuando se quita una publicacion
        animal.setEstado(ESTADO_PUBLICACION_ELIMINADA);
        animalRepository.save(animal);

        String texto = "No aprobamos la publicación de " + animal.getNombreAnimal() + ".";
        if (motivo != null && !motivo.isBlank()) {
            texto += " Motivo: " + motivo.trim();
        }
        avisarAlRefugio(animal, texto);
    }

    // Le deja una notificacion al dueño del refugio del animal (si el refugio tiene uno)
    private void avisarAlRefugio(Animal animal, String texto) {
        Usuario dueno = animal.getRefugio().getUsuario();
        if (dueno != null) {
            notificacionService.notificar(dueno, texto);
        }
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

        // Si la quito un administrador (y no el propio refugio), se le avisa al refugio
        Refugio refugioPropio = autorizacionService.usuarioActual().getRefugio();
        boolean laQuitoSuRefugio = refugioPropio != null && refugioPropio.getIdRefugio().equals(animal.getRefugio().getIdRefugio());
        if (!laQuitoSuRefugio) {
            avisarAlRefugio(animal, "Un administrador quitó la publicación de " + animal.getNombreAnimal() + " del catálogo.");
        }
    }
}