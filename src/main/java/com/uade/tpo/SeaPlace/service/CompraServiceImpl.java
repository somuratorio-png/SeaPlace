package com.uade.tpo.SeaPlace.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.SeaPlace.entity.Animal;
import com.uade.tpo.SeaPlace.entity.Carrito;
import com.uade.tpo.SeaPlace.entity.CarritoDetalle;
import com.uade.tpo.SeaPlace.entity.Compra;
import com.uade.tpo.SeaPlace.entity.CompraDetalle;
import com.uade.tpo.SeaPlace.entity.Descuento;
import com.uade.tpo.SeaPlace.entity.Usuario;
import com.uade.tpo.SeaPlace.entity.dto.CompraRequest;
import com.uade.tpo.SeaPlace.repository.AnimalRepository;
import com.uade.tpo.SeaPlace.repository.CarritoDetalleRepository;
import com.uade.tpo.SeaPlace.repository.CarritoRepository;
import com.uade.tpo.SeaPlace.repository.CompraDetalleRepository;
import com.uade.tpo.SeaPlace.repository.CompraRepository;
import com.uade.tpo.SeaPlace.repository.DescuentoRepository;
import com.uade.tpo.SeaPlace.repository.UsuarioRepository;

@Service
public class CompraServiceImpl implements CompraService {

    private static final String ESTADO_CARRITO_ACTIVO = "ACTIVO";
    private static final String ESTADO_CARRITO_CONFIRMADO = "CONFIRMADO";
    private static final String ESTADO_COMPRA_CONFIRMADA = "CONFIRMADA";
    private static final String ESTADO_PUBLICACION_ACTIVA = "ACTIVA";

    @Autowired
    private CompraRepository compraRepository;

    @Autowired
    private CompraDetalleRepository compraDetalleRepository;

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private CarritoDetalleRepository carritoDetalleRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private DescuentoRepository descuentoRepository;

    @Override
    public Page<Compra> getComprasByUsuario(Long idUsuario, PageRequest pageRequest) {
        return compraRepository.findByUsuario_IdUsuario(idUsuario, pageRequest);
    }

    @Override
    public Optional<Compra> getCompraById(Long compraId) {
        return compraRepository.findById(compraId);
    }

    // El checkout es todo-o-nada: si falla la validacion de cualquier item, no se confirma
    // nada ni se descuenta ningun cupo. La transaccion revierte todo ante una excepcion.
    @Override
    @Transactional
    public Compra confirmarCompra(CompraRequest request) {
        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new IllegalArgumentException(
                        "No existe el usuario con id " + request.getIdUsuario()));

        Carrito carrito = carritoRepository.findById(request.getIdCarrito())
                .orElseThrow(() -> new IllegalArgumentException(
                        "No existe el carrito con id " + request.getIdCarrito()));

        if (!carrito.getUsuario().getIdUsuario().equals(usuario.getIdUsuario())) {
            throw new IllegalArgumentException("El carrito no pertenece al usuario");
        }

        if (!ESTADO_CARRITO_ACTIVO.equals(carrito.getEstado())) {
            throw new IllegalArgumentException("El carrito ya fue confirmado o no esta activo");
        }

        List<CarritoDetalle> detallesDelCarrito = carritoDetalleRepository
                .findByCarrito_IdCarrito(carrito.getIdCarrito());

        if (detallesDelCarrito.isEmpty()) {
            throw new IllegalArgumentException("El carrito esta vacio");
        }

        // PRIMERA PASADA: la consigna exige validar el stock antes de descontar. Se valida el
        // carrito completo antes de modificar nada para no dejar compras a medias.
        for (CarritoDetalle detalleCarrito : detallesDelCarrito) {
            Animal animal = detalleCarrito.getAnimal();

            if (!ESTADO_PUBLICACION_ACTIVA.equals(animal.getEstado())) {
                throw new IllegalArgumentException(
                        "La publicacion del animal " + animal.getNombreAnimal() + " ya no esta activa");
            }

            if (detalleCarrito.getCantidad() > animal.getCuposDisponibles()) {
                throw new IllegalArgumentException(
                        "No hay cupos suficientes para " + animal.getNombreAnimal()
                                + ": quedan " + animal.getCuposDisponibles()
                                + " y el carrito pide " + detalleCarrito.getCantidad());
            }
        }

        Compra compra = new Compra();
        compra.setUsuario(usuario);
        compra.setFechaCompra(LocalDateTime.now());
        compra.setEstado(ESTADO_COMPRA_CONFIRMADA);
        compra.setTotal(0.0);
        compra = compraRepository.save(compra);

        // SEGUNDA PASADA: con todo validado, se arma el detalle y se descuenta el stock.
        double totalCompra = 0.0;
        LocalDate hoy = LocalDate.now();

        for (CarritoDetalle detalleCarrito : detallesDelCarrito) {
            Animal animal = detalleCarrito.getAnimal();
            int cantidad = detalleCarrito.getCantidad();

            double precioFinal = calcularPrecioFinal(animal, hoy);
            double subtotal = redondearADosDecimales(precioFinal * cantidad);

            // Requisito de la consigna: el stock se descuenta recien en el checkout, no al
            // agregar al carrito.
            animal.setCuposDisponibles(animal.getCuposDisponibles() - cantidad);
            animalRepository.save(animal);

            CompraDetalle detalleCompra = new CompraDetalle();
            detalleCompra.setCompra(compra);
            detalleCompra.setAnimal(animal);
            detalleCompra.setCantidad(cantidad);
            detalleCompra.setPrecioUnitario(precioFinal);
            detalleCompra.setSubtotal(subtotal);
            compraDetalleRepository.save(detalleCompra);

            totalCompra += subtotal;
        }

        compra.setTotal(redondearADosDecimales(totalCompra));
        compra = compraRepository.save(compra);

        // El carrito confirmado se marca CONFIRMADO y deja de ser el activo; el proximo
        // getOrCreateCarritoActivo abrira uno nuevo para el usuario.
        carritoDetalleRepository.deleteAll(detallesDelCarrito);
        carrito.setEstado(ESTADO_CARRITO_CONFIRMADO);
        carritoRepository.save(carrito);

        return compra;
    }

    private double calcularPrecioFinal(Animal animal, LocalDate fecha) {
        // Se usa la cuota vigente del animal al momento de confirmar, no la guardada en el
        // carrito, porque el precio vinculante es el del checkout.
        double cuota = animal.getCuotaApadrinamiento();

        List<Descuento> descuentosVigentes = descuentoRepository
                .findVigentesByAnimal(animal.getIdAnimal(), fecha);

        // Si hay campanias de descuento solapadas, se aplica solo la de mayor porcentaje:
        // la mas beneficiosa para el padrino.
        double porcentajeDescuento = descuentosVigentes.stream()
                .map(Descuento::getPorcentaje)
                .max(Comparator.naturalOrder())
                .orElse(0.0);

        double precioFinal = cuota * (1 - porcentajeDescuento / 100);
        return redondearADosDecimales(precioFinal);
    }

    private double redondearADosDecimales(double valor) {
        return Math.round(valor * 100.0) / 100.0;
    }
}
