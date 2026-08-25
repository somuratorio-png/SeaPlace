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

    @Override
    public Carrito getOrCreateCarritoActivo(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No existe el usuario con id " + idUsuario));

        // Un usuario tiene a lo sumo un carrito activo a la vez; si no lo tiene, se le abre uno.
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
            throw new IllegalArgumentException("La cantidad debe ser un numero mayor a 0");
        }

        Carrito carrito = carritoRepository.findById(request.getIdCarrito())
                .orElseThrow(() -> new IllegalArgumentException(
                        "No existe el carrito con id " + request.getIdCarrito()));

        Animal animal = animalRepository.findById(request.getIdAnimal())
                .orElseThrow(() -> new IllegalArgumentException(
                        "No existe el animal con id " + request.getIdAnimal()));

        // Solo se puede apadrinar un animal cuya publicacion sigue activa; las pausadas o
        // finalizadas ya no aceptan nuevos padrinos.
        if (!ESTADO_PUBLICACION_ACTIVA.equals(animal.getEstado())) {
            throw new IllegalArgumentException(
                    "La publicacion del animal " + animal.getNombreAnimal() + " no esta activa");
        }

        Optional<CarritoDetalle> detalleExistente = carritoDetalleRepository
                .findByCarrito_IdCarritoAndAnimal_IdAnimal(carrito.getIdCarrito(), animal.getIdAnimal());

        int cantidadYaEnCarrito = detalleExistente.map(CarritoDetalle::getCantidad).orElse(0);
        int cantidadFinal = cantidadYaEnCarrito + request.getCantidad();

        // Requisito de la consigna: sin cupos no se puede agregar al carrito. Cada cupo es un
        // lugar de padrino, y el total acumulado en el carrito no puede superar los que quedan libres.
        if (cantidadFinal > animal.getCuposDisponibles()) {
            throw new IllegalArgumentException(
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
            // Se congela la cuota vigente al momento de agregar, para que el precio del carrito
            // no cambie si el refugio actualiza la cuota despues.
            detalle.setPrecioUnitario(animal.getCuotaApadrinamiento());
        }

        // Los cupos NO se descuentan aca: el carrito es solo una intencion de compra. Segun la
        // consigna del TPO, los cupos se descuentan recien al confirmar la compra.
        return carritoDetalleRepository.save(detalle);
    }

    @Override
    @Transactional
    public void quitarItem(Long carritoId, Long animalId) {
        carritoDetalleRepository.deleteByCarrito_IdCarritoAndAnimal_IdAnimal(carritoId, animalId);
    }

    @Override
    public List<CarritoDetalle> getItems(Long carritoId) {
        return carritoDetalleRepository.findByCarrito_IdCarrito(carritoId);
    }
}
