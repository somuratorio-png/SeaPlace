package com.uade.tpo.SeaPlace.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.SeaPlace.entity.Animal;
import com.uade.tpo.SeaPlace.entity.Muelle;
import com.uade.tpo.SeaPlace.entity.MuelleDetalle;
import com.uade.tpo.SeaPlace.entity.Usuario;
import com.uade.tpo.SeaPlace.entity.dto.MuelleDetalleRequest;
import com.uade.tpo.SeaPlace.exceptions.RecursoNoEncontradoException;
import com.uade.tpo.SeaPlace.exceptions.ReglaDeNegocioException;
import com.uade.tpo.SeaPlace.repository.AnimalRepository;
import com.uade.tpo.SeaPlace.repository.MuelleDetalleRepository;
import com.uade.tpo.SeaPlace.repository.MuelleRepository;
import com.uade.tpo.SeaPlace.repository.UsuarioRepository;

@Service
public class MuelleServiceImpl implements MuelleService {

    private static final String ESTADO_MUELLE_ACTIVO = "ACTIVO";
    private static final String ESTADO_PUBLICACION_ACTIVA = "ACTIVA";

    @Autowired
    private MuelleRepository muelleRepository;

    @Autowired
    private MuelleDetalleRepository muelleDetalleRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private AutorizacionService autorizacionService;

    @Override
    public Muelle getOrCreateMuelleActivo(Long idUsuario) {
        // Un usuario solo puede pedir su propio carrito (o un admin, cualquiera).
        autorizacionService.validarPropietarioOAdmin(idUsuario);

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el usuario con id " + idUsuario));

        return muelleRepository.findByUsuario_IdUsuarioAndEstado(idUsuario, ESTADO_MUELLE_ACTIVO)
                .orElseGet(() -> {
                    Muelle muelleNuevo = new Muelle();
                    muelleNuevo.setUsuario(usuario);
                    muelleNuevo.setFechaCreacion(LocalDateTime.now());
                    muelleNuevo.setEstado(ESTADO_MUELLE_ACTIVO);
                    return muelleRepository.save(muelleNuevo);
                });
    }

    @Override
    public MuelleDetalle agregarItem(MuelleDetalleRequest request) {
        if (request.getCantidad() == null || request.getCantidad() <= 0) {
            throw new ReglaDeNegocioException("La cantidad debe ser un numero mayor a 0");
        }

        Muelle muelle = muelleRepository.findById(request.getIdMuelle())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el muelle con id " + request.getIdMuelle()));

        // Solo el dueño del carrito (o un admin) puede agregarle items.
        autorizacionService.validarPropietarioOAdmin(muelle.getUsuario().getIdUsuario());

        Animal animal = animalRepository.findById(request.getIdAnimal())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el animal con id " + request.getIdAnimal()));

        if (!ESTADO_PUBLICACION_ACTIVA.equals(animal.getEstado())) {
            throw new ReglaDeNegocioException(
                    "La publicacion del animal " + animal.getNombreAnimal() + " no esta activa");
        }

        Optional<MuelleDetalle> detalleExistente = muelleDetalleRepository
                .findByMuelle_IdMuelleAndAnimal_IdAnimal(muelle.getIdMuelle(), animal.getIdAnimal());

        int cantidadYaEnMuelle = detalleExistente.map(MuelleDetalle::getCantidad).orElse(0);
        int cantidadFinal = cantidadYaEnMuelle + request.getCantidad();

        if (cantidadFinal > animal.getCuposDisponibles()) {
            throw new ReglaDeNegocioException(
                    "No hay cupos suficientes para " + animal.getNombreAnimal()
                            + ": quedan " + animal.getCuposDisponibles()
                            + " y se intentan reservar " + cantidadFinal);
        }

        MuelleDetalle detalle;
        if (detalleExistente.isPresent()) {
            detalle = detalleExistente.get();
            detalle.setCantidad(cantidadFinal);
        } else {
            detalle = new MuelleDetalle();
            detalle.setMuelle(muelle);
            detalle.setAnimal(animal);
            detalle.setCantidad(cantidadFinal);
            detalle.setPrecioUnitario(animal.getCuotaApadrinamiento());
        }

        return muelleDetalleRepository.save(detalle);
    }

    @Override
    public MuelleDetalle modificarCantidad(Long muelleId, Long animalId, Integer cantidad) {
        if (cantidad == null || cantidad <= 0) {
            throw new ReglaDeNegocioException("La cantidad debe ser un numero mayor a 0");
        }

        MuelleDetalle detalle = muelleDetalleRepository
                .findByMuelle_IdMuelleAndAnimal_IdAnimal(muelleId, animalId)
                .orElseThrow(() -> new RecursoNoEncontradoException("El animal no esta en el muelle"));

        // Solo el dueño del carrito (o un admin) puede modificarlo.
        autorizacionService.validarPropietarioOAdmin(detalle.getMuelle().getUsuario().getIdUsuario());

        Animal animal = detalle.getAnimal();

        if (!ESTADO_PUBLICACION_ACTIVA.equals(animal.getEstado())) {
            throw new ReglaDeNegocioException(
                    "La publicacion del animal " + animal.getNombreAnimal() + " no esta activa");
        }

        if (cantidad > animal.getCuposDisponibles()) {
            throw new ReglaDeNegocioException(
                    "No hay cupos suficientes para " + animal.getNombreAnimal()
                            + ": quedan " + animal.getCuposDisponibles()
                            + " y se intentan reservar " + cantidad);
        }

        detalle.setCantidad(cantidad);
        return muelleDetalleRepository.save(detalle);
    }

    @Override
    @Transactional
    public void quitarItem(Long muelleId, Long animalId) {
        Muelle muelle = muelleRepository.findById(muelleId)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el muelle con id " + muelleId));

        // Solo el dueño del carrito (o un admin) puede sacarle items.
        autorizacionService.validarPropietarioOAdmin(muelle.getUsuario().getIdUsuario());

        muelleDetalleRepository.deleteByMuelle_IdMuelleAndAnimal_IdAnimal(muelleId, animalId);
    }

    @Override
    public List<MuelleDetalle> getItems(Long muelleId) {
        Muelle muelle = muelleRepository.findById(muelleId)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el muelle con id " + muelleId));

        // Solo el dueño del carrito (o un admin) puede ver sus items.
        autorizacionService.validarPropietarioOAdmin(muelle.getUsuario().getIdUsuario());

        return muelleDetalleRepository.findByMuelle_IdMuelle(muelleId);
    }
}