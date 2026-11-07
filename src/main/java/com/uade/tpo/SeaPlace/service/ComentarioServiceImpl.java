package com.uade.tpo.SeaPlace.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.uade.tpo.SeaPlace.entity.Animal;
import com.uade.tpo.SeaPlace.entity.Comentario;
import com.uade.tpo.SeaPlace.entity.Novedad;
import com.uade.tpo.SeaPlace.entity.Refugio;
import com.uade.tpo.SeaPlace.entity.Usuario;
import com.uade.tpo.SeaPlace.entity.dto.ComentarioRequest;
import com.uade.tpo.SeaPlace.exceptions.RecursoNoEncontradoException;
import com.uade.tpo.SeaPlace.exceptions.ReglaDeNegocioException;
import com.uade.tpo.SeaPlace.repository.ApadrinamientoRepository;
import com.uade.tpo.SeaPlace.repository.ComentarioRepository;
import com.uade.tpo.SeaPlace.repository.NovedadRepository;

@Service
public class ComentarioServiceImpl implements ComentarioService {

    private static final int LARGO_MAXIMO = 500;

    // Cuanto del comentario se copia en la notificacion al refugio
    private static final int LARGO_ADELANTO = 100;

    @Autowired
    private ComentarioRepository comentarioRepository;

    @Autowired
    private NovedadRepository novedadRepository;

    @Autowired
    private ApadrinamientoRepository apadrinamientoRepository;

    @Autowired
    private AutorizacionService autorizacionService;

    @Autowired
    private NotificacionService notificacionService;

    // Los de la pagina son publicos: los ve cualquiera, aunque no haya iniciado sesion.
    @Override
    public List<Comentario> getComentariosPagina() {
        return comentarioRepository.findByNovedadIsNullOrderByFechaDesc();
    }

    // Cualquier usuario logueado puede dejar un comentario sobre la pagina.
    @Override
    public Comentario comentarPagina(ComentarioRequest request) {
        return guardar(null, request);
    }

    @Override
    public List<Comentario> getComentariosNovedad(Long animalId, Long novedadId) {
        Novedad novedad = buscarNovedad(animalId, novedadId);
        validarPuedeConversar(novedad.getAnimal());
        return comentarioRepository.findByNovedad_IdNovedadOrderByFechaAsc(novedadId);
    }

    // En la bitacora conversan los que acompañan al animal: sus padrinos de hoy y su refugio (o un admin).
    // Si comenta otro que no es el refugio, se le avisa al refugio para que pueda responder.
    @Override
    public Comentario comentarNovedad(Long animalId, Long novedadId, ComentarioRequest request) {
        Novedad novedad = buscarNovedad(animalId, novedadId);
        Animal animal = novedad.getAnimal();
        validarPuedeConversar(animal);

        Comentario guardado = guardar(novedad, request);

        Usuario dueno = animal.getRefugio().getUsuario();
        Usuario autor = guardado.getUsuario();
        if (dueno != null && !dueno.getIdUsuario().equals(autor.getIdUsuario())) {
            String texto = guardado.getTexto();
            String adelanto = texto.length() > LARGO_ADELANTO ? texto.substring(0, LARGO_ADELANTO).trim() + "…" : texto;
            notificacionService.notificar(dueno, autor.getNombre() + " " + autor.getApellido() + " comentó una novedad de "
                    + animal.getNombreAnimal() + ": \"" + adelanto + "\"");
        }
        return guardado;
    }

    // Lo puede borrar quien lo escribio o un admin (para moderar).
    @Override
    public void deleteComentario(Long comentarioId) {
        Comentario comentario = comentarioRepository.findById(comentarioId)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el comentario con id " + comentarioId));

        autorizacionService.validarPropietarioOAdmin(comentario.getUsuario().getIdUsuario());
        comentarioRepository.delete(comentario);
    }

    // La novedad tiene que existir, ser de ese animal (asi la url no mezcla uno con otro)
    // y el animal tiene que estar visible para quien pregunta.
    private Novedad buscarNovedad(Long animalId, Long novedadId) {
        return novedadRepository.findById(novedadId)
                .filter(novedad -> novedad.getAnimal().getIdAnimal().equals(animalId))
                .filter(novedad -> autorizacionService.puedeVerAnimal(novedad.getAnimal()))
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe la novedad con id " + novedadId + " del animal con id " + animalId));
    }

    // Un admin, el refugio dueño del animal o alguien que lo apadrina hoy.
    // El GET de /animales/** es publico: sin token se llega aca sin usuario y no se puede conversar.
    private void validarPuedeConversar(Animal animal) {
        Usuario actual = autorizacionService.usuarioActualONull();
        if (actual == null) {
            throw new AccessDeniedException("Tenes que iniciar sesion para ver los comentarios de las novedades");
        }
        if (autorizacionService.esAdmin()) {
            return;
        }
        Refugio refugioPropio = actual.getRefugio();
        if (refugioPropio != null && refugioPropio.getIdRefugio().equals(animal.getRefugio().getIdRefugio())) {
            return;
        }
        boolean esPadrino = apadrinamientoRepository
                .findByUsuario_IdUsuarioAndAnimal_IdAnimalAndActivoTrue(actual.getIdUsuario(), animal.getIdAnimal())
                .isPresent();
        if (!esPadrino) {
            throw new AccessDeniedException(
                    "Solo los padrinos de " + animal.getNombreAnimal() + " y su refugio pueden comentar sus novedades");
        }
    }

    private Comentario guardar(Novedad novedad, ComentarioRequest request) {
        String texto = request.getTexto() == null ? "" : request.getTexto().trim();
        if (texto.isEmpty()) {
            throw new ReglaDeNegocioException("El texto del comentario es obligatorio");
        }
        if (texto.length() > LARGO_MAXIMO) {
            throw new ReglaDeNegocioException("El comentario no puede superar los " + LARGO_MAXIMO + " caracteres");
        }

        Comentario comentario = new Comentario();
        comentario.setUsuario(autorizacionService.usuarioActual());
        comentario.setNovedad(novedad);
        comentario.setTexto(texto);
        comentario.setFecha(LocalDateTime.now());
        return comentarioRepository.save(comentario);
    }
}
