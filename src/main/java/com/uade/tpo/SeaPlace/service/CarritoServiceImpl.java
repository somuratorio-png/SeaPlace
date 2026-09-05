package com.uade.tpo.SeaPlace.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.SeaPlace.entity.Animal;
import com.uade.tpo.SeaPlace.entity.Carrito;
import com.uade.tpo.SeaPlace.entity.CarritoDetalle;
import com.uade.tpo.SeaPlace.entity.Usuario;
import com.uade.tpo.SeaPlace.entity.dto.CarritoDetalleRequest;
import com.uade.tpo.SeaPlace.exceptions.RecursoNoEncontradoException;
import com.uade.tpo.SeaPlace.exceptions.ReglaDeNegocioException;
import com.uade.tpo.SeaPlace.repository.AnimalRepository;
import com.uade.tpo.SeaPlace.repository.CarritoDetalleRepository;
import com.uade.tpo.SeaPlace.repository.CarritoRepository;
import com.uade.tpo.SeaPlace.repository.UsuarioRepository;

@Service
public class CarritoServiceImpl implements CarritoService {

    private static final String ESTADO_CARRITO_ACTIVO = "ACTIVO";
    private static final String ESTADO_PUBLICACION_ACTIVA = "ACTIVA";

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private CarritoDetalleRepository carritoDetalleRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private AutorizacionService autorizacionService;

    @Override
    public Carrito getOrCreateCarritoActivo(Long idUsuario) {
        // Un usuario solo puede pedir su propio carrito (o un admin, cualquiera).
        autorizacionService.validarPropietarioOAdmin(idUsuario);

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el usuario con id " + idUsuario));

        return carritoRepository.findByUsuario_IdUsuarioAndEstado(idUsuario, ESTADO_CARRITO_ACTIVO)
                .orElseGet(() -> {
                    Carrito carritoNuevo = new Carrito();
                    carritoNuevo.setUsuario(usuario);
                    carritoNuevo.setFechaCreacion(LocalDateTime.now());
                    carritoNuevo.setEstado(ESTADO_CARRITO_ACTIVO);
                    return carritoRepository.save(carritoNuevo);
                });
    }

    @Override
    public CarritoDetalle agregarItem(CarritoDetalleRequest request) {
        if (request.getCantidad() == null || request.getCantidad() <= 0) {
            throw new ReglaDeNegocioException("La cantidad debe ser un numero mayor a 0");
        }

        Carrito carrito = carritoRepository.findById(request.getIdCarrito())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el carrito con id " + request.getIdCarrito()));

        // Solo el dueño del carrito (o un admin) puede agregarle items.
        autorizacionService.validarPropietarioOAdmin(carrito.getUsuario().getIdUsuario());

        Animal animal = animalRepository.findById(request.getIdAnimal())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el animal con id " + request.getIdAnimal()));

        if (!ESTADO_PUBLICACION_ACTIVA.equals(animal.getEstado())) {
            throw new ReglaDeNegocioException(
                    "La publicacion del animal " + animal.getNombreAnimal() + " no esta activa");
        }

        Optional<CarritoDetalle> detalleExistente = carritoDetalleRepository
                .findByCarrito_IdCarritoAndAnimal_IdAnimal(carrito.getIdCarrito(), animal.getIdAnimal());

        int cantidadYaEnCarrito = detalleExistente.map(CarritoDetalle::getCantidad).orElse(0);
        int cantidadFinal = cantidadYaEnCarrito + request.getCantidad();

        if (cantidadFinal > animal.getCuposDisponibles()) {
            throw new ReglaDeNegocioException(
                    "No hay cupos suficientes para " + animal.getNombreAnimal()
                            + ": quedan " + animal.getCuposDisponibles()
                            + " y se intentan reservar " + cantidadFinal);
        }

        CarritoDetalle detalle;
        if (detalleExistente.isPresent()) {
            detalle = detalleExistente.get();
            detalle.setCantidad(cantidadFinal);
        } else {
            detalle = new CarritoDetalle();
            detalle.setCarrito(carrito);
            detalle.setAnimal(animal);
            detalle.setCantidad(cantidadFinal);
            detalle.setPrecioUnitario(animal.getCuotaApadrinamiento());
        }

        return carritoDetalleRepository.save(detalle);
    }

    @Override
    public CarritoDetalle modificarCantidad(Long carritoId, Long animalId, Integer cantidad) {
        if (cantidad == null || cantidad <= 0) {
            throw new ReglaDeNegocioException("La cantidad debe ser un numero mayor a 0");
        }

        CarritoDetalle detalle = carritoDetalleRepository
                .findByCarrito_IdCarritoAndAnimal_IdAnimal(carritoId, animalId)
                .orElseThrow(() -> new RecursoNoEncontradoException("El animal no esta en el carrito"));

        // Solo el dueño del carrito (o un admin) puede modificarlo.
        autorizacionService.validarPropietarioOAdmin(detalle.getCarrito().getUsuario().getIdUsuario());

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
        return carritoDetalleRepository.save(detalle);
    }

    @Override
    @Transactional
    public void quitarItem(Long carritoId, Long animalId) {
        Carrito carrito = carritoRepository.findById(carritoId)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el carrito con id " + carritoId));

        // Solo el dueño del carrito (o un admin) puede sacarle items.
        autorizacionService.validarPropietarioOAdmin(carrito.getUsuario().getIdUsuario());

        carritoDetalleRepository.deleteByCarrito_IdCarritoAndAnimal_IdAnimal(carritoId, animalId);
    }

    @Override
    public List<CarritoDetalle> getItems(Long carritoId) {
        Carrito carrito = carritoRepository.findById(carritoId)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el carrito con id " + carritoId));

        // Solo el dueño del carrito (o un admin) puede ver sus items.
        autorizacionService.validarPropietarioOAdmin(carrito.getUsuario().getIdUsuario());

        return carritoDetalleRepository.findByCarrito_IdCarrito(carritoId);
    }
}