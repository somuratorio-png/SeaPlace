package com.uade.tpo.SeaPlace.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.SeaPlace.entity.Animal;
import com.uade.tpo.SeaPlace.entity.Muelle;
import com.uade.tpo.SeaPlace.entity.MuelleDetalle;
import com.uade.tpo.SeaPlace.entity.Zarpar;
import com.uade.tpo.SeaPlace.entity.ZarparDetalle;
import com.uade.tpo.SeaPlace.entity.Descuento;
import com.uade.tpo.SeaPlace.entity.Usuario;
import com.uade.tpo.SeaPlace.entity.dto.ZarparRequest;
import com.uade.tpo.SeaPlace.exceptions.ReglaDeNegocioException;
import com.uade.tpo.SeaPlace.exceptions.RecursoNoEncontradoException;
import com.uade.tpo.SeaPlace.repository.AnimalRepository;
import com.uade.tpo.SeaPlace.repository.MuelleDetalleRepository;
import com.uade.tpo.SeaPlace.repository.MuelleRepository;
import com.uade.tpo.SeaPlace.repository.ZarparDetalleRepository;
import com.uade.tpo.SeaPlace.repository.ZarparRepository;
import com.uade.tpo.SeaPlace.repository.DescuentoRepository;
import com.uade.tpo.SeaPlace.repository.UsuarioRepository;

@Service
public class ZarparServiceImpl implements ZarparService {

    private static final String ESTADO_MUELLE_ACTIVO = "ACTIVO";
    private static final String ESTADO_MUELLE_CONFIRMADO = "CONFIRMADO";
    private static final String ESTADO_ZARPAR_CONFIRMADA = "CONFIRMADA";
    private static final String ESTADO_PUBLICACION_ACTIVA = "ACTIVA";

    @Autowired
    private ZarparRepository zarparRepository;

    @Autowired
    private ZarparDetalleRepository zarparDetalleRepository;

    @Autowired
    private MuelleRepository muelleRepository;

    @Autowired
    private MuelleDetalleRepository muelleDetalleRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private DescuentoRepository descuentoRepository;

    @Autowired
    private AutorizacionService autorizacionService;

    @Override
    public Page<Zarpar> getZarparsByUsuario(Long idUsuario, PageRequest pageRequest) {
        // Un usuario solo puede ver sus propias compras (o un admin, cualquiera).
        autorizacionService.validarPropietarioOAdmin(idUsuario);
        return zarparRepository.findByUsuario_IdUsuario(idUsuario, pageRequest);
    }

    @Override
    public Optional<Zarpar> getZarparById(Long zarparId) {
        Optional<Zarpar> zarpar = zarparRepository.findById(zarparId);
        zarpar.ifPresent(c -> autorizacionService.validarPropietarioOAdmin(c.getUsuario().getIdUsuario()));
        return zarpar;
    }

    @Override
    @Transactional
    public Zarpar confirmarZarpar(ZarparRequest request) {
        if (request.getIdUsuario() == null) {
            throw new ReglaDeNegocioException("El campo 'idUsuario' es obligatorio");
        }
        if (request.getIdMuelle() == null) {
            throw new ReglaDeNegocioException("El campo 'idMuelle' es obligatorio");
        }

        // El usuario solo puede confirmar compras a su propio nombre (o un admin, en nombre
        // de cualquiera).
        autorizacionService.validarPropietarioOAdmin(request.getIdUsuario());

        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el usuario con id " + request.getIdUsuario()));

        Muelle muelle = muelleRepository.findById(request.getIdMuelle())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el muelle con id " + request.getIdMuelle()));

        if (!muelle.getUsuario().getIdUsuario().equals(usuario.getIdUsuario())) {
            throw new ReglaDeNegocioException("El muelle no pertenece al usuario");
        }

        if (!ESTADO_MUELLE_ACTIVO.equals(muelle.getEstado())) {
            throw new ReglaDeNegocioException("El muelle ya fue confirmado o no esta activo");
        }

        List<MuelleDetalle> detallesDelMuelle = muelleDetalleRepository
                .findByMuelle_IdMuelle(muelle.getIdMuelle());

        if (detallesDelMuelle.isEmpty()) {
            throw new ReglaDeNegocioException("El muelle esta vacio");
        }

        for (MuelleDetalle detalleMuelle : detallesDelMuelle) {
            Animal animal = detalleMuelle.getAnimal();

            if (!ESTADO_PUBLICACION_ACTIVA.equals(animal.getEstado())) {
                throw new ReglaDeNegocioException(
                        "La publicacion del animal " + animal.getNombreAnimal() + " ya no esta activa");
            }

            if (detalleMuelle.getCantidad() > animal.getCuposDisponibles()) {
                throw new ReglaDeNegocioException(
                        "No hay cupos suficientes para " + animal.getNombreAnimal()
                                + ": quedan " + animal.getCuposDisponibles()
                                + " y el muelle pide " + detalleMuelle.getCantidad());
            }
        }

        Zarpar zarpar = new Zarpar();
        zarpar.setUsuario(usuario);
        zarpar.setFechaZarpar(LocalDateTime.now());
        zarpar.setEstado(ESTADO_ZARPAR_CONFIRMADA);
        zarpar.setTotal(0.0);
        zarpar = zarparRepository.save(zarpar);

        double totalZarpar = 0.0;
        LocalDate hoy = LocalDate.now();
        List<ZarparDetalle> detallesCreados = new ArrayList<>();

        for (MuelleDetalle detalleMuelle : detallesDelMuelle) {
            Animal animal = detalleMuelle.getAnimal();
            int cantidad = detalleMuelle.getCantidad();

            double precioFinal = calcularPrecioFinal(animal, hoy);
            double subtotal = redondearADosDecimales(precioFinal * cantidad);

            animal.setCuposDisponibles(animal.getCuposDisponibles() - cantidad);
            animalRepository.save(animal);

            ZarparDetalle detalleZarpar = new ZarparDetalle();
            detalleZarpar.setZarpar(zarpar);
            detalleZarpar.setAnimal(animal);
            detalleZarpar.setCantidad(cantidad);
            detalleZarpar.setPrecioUnitario(precioFinal);
            detalleZarpar.setSubtotal(subtotal);
            detallesCreados.add(zarparDetalleRepository.save(detalleZarpar));

            totalZarpar += subtotal;
        }

        zarpar.setTotal(redondearADosDecimales(totalZarpar));
        zarpar = zarparRepository.save(zarpar);

        muelleDetalleRepository.deleteAll(detallesDelMuelle);
        muelle.setEstado(ESTADO_MUELLE_CONFIRMADO);
        muelleRepository.save(muelle);

        zarpar.setDetalles(detallesCreados);
        return zarpar;
    }

    private double calcularPrecioFinal(Animal animal, LocalDate fecha) {
        double cuota = animal.getCuotaApadrinamiento();

        List<Descuento> descuentosVigentes = descuentoRepository
                .findVigentesByAnimal(animal.getIdAnimal(), fecha);

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