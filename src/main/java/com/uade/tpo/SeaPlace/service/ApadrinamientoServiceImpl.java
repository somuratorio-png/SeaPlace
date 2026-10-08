package com.uade.tpo.SeaPlace.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.SeaPlace.entity.Animal;
import com.uade.tpo.SeaPlace.entity.Apadrinamiento;
import com.uade.tpo.SeaPlace.entity.Plan;
import com.uade.tpo.SeaPlace.entity.Usuario;
import com.uade.tpo.SeaPlace.entity.ZarparDetalle;
import com.uade.tpo.SeaPlace.exceptions.RecursoNoEncontradoException;
import com.uade.tpo.SeaPlace.exceptions.ReglaDeNegocioException;
import com.uade.tpo.SeaPlace.repository.AnimalRepository;
import com.uade.tpo.SeaPlace.repository.ApadrinamientoRepository;
import com.uade.tpo.SeaPlace.repository.ZarparDetalleRepository;

@Service
public class ApadrinamientoServiceImpl implements ApadrinamientoService {

    @Autowired
    private ApadrinamientoRepository apadrinamientoRepository;

    @Autowired
    private ZarparDetalleRepository zarparDetalleRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private AutorizacionService autorizacionService;

    // Cada uno ve los apadrinamientos que le corresponden: un administrador ve todos,
    // el dueño de un refugio los de sus animales, y un padrino los propios.
    @Override
    public List<Apadrinamiento> getApadrinamientos() {
        Usuario actual = autorizacionService.usuarioActual();

        if (autorizacionService.esAdmin()) {
            return apadrinamientoRepository.findAll();
        }
        if (actual.getRefugio() != null) {
            return apadrinamientoRepository.findByAnimal_Refugio_IdRefugio(actual.getRefugio().getIdRefugio());
        }
        return apadrinamientoRepository.findByUsuario_IdUsuario(actual.getIdUsuario());
    }

    // Los pagos de un apadrinamiento son los renglones de zarpar de ese padrino para ese
    // animal hechos mientras estuvo vigente (si lo cancelo y volvio a apadrinar, cada
    // apadrinamiento muestra solo los suyos).
    @Override
    public List<ZarparDetalle> getPagos(Apadrinamiento apadrinamiento) {
        LocalDateTime desde = apadrinamiento.getFechaInicio();
        LocalDateTime hasta = apadrinamiento.getFechaCancelacion();

        return zarparDetalleRepository
                .findByZarpar_Usuario_IdUsuarioAndAnimal_IdAnimalOrderByZarpar_FechaZarparAsc(
                        apadrinamiento.getUsuario().getIdUsuario(),
                        apadrinamiento.getAnimal().getIdAnimal())
                .stream()
                .filter(pago -> !pago.getZarpar().getFechaZarpar().isBefore(desde))
                .filter(pago -> hasta == null || !pago.getZarpar().getFechaZarpar().isAfter(hasta))
                .toList();
    }

    @Override
    public Apadrinamiento cambiarPlan(Long apadrinamientoId, String plan) {
        Apadrinamiento apadrinamiento = buscarVigente(apadrinamientoId);

        if (plan == null || plan.isBlank()) {
            throw new ReglaDeNegocioException("El campo 'plan' es obligatorio");
        }

        // El cambio rige desde el proximo pago: lo ya pagado no se toca.
        apadrinamiento.setPlan(Plan.desde(plan));
        return apadrinamientoRepository.save(apadrinamiento);
    }

    @Override
    @Transactional
    public Apadrinamiento cancelar(Long apadrinamientoId) {
        Apadrinamiento apadrinamiento = buscarVigente(apadrinamientoId);

        // No se borra: queda inactivo, asi el historial no se pierde.
        apadrinamiento.setActivo(false);
        apadrinamiento.setFechaCancelacion(LocalDateTime.now());

        // Los cupos que tenia tomados vuelven a quedar disponibles para ese animal.
        Animal animal = apadrinamiento.getAnimal();
        int cuposLiberados = animal.getCuposDisponibles() + apadrinamiento.getCupos();
        animal.setCuposDisponibles(Math.min(cuposLiberados, animal.getCuposTotales()));
        animalRepository.save(animal);

        return apadrinamientoRepository.save(apadrinamiento);
    }

    // Busca el apadrinamiento y controla que sea de quien lo pide (o de un admin) y que siga activo.
    private Apadrinamiento buscarVigente(Long apadrinamientoId) {
        Apadrinamiento apadrinamiento = apadrinamientoRepository.findById(apadrinamientoId)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el apadrinamiento con id " + apadrinamientoId));

        autorizacionService.validarPropietarioOAdmin(apadrinamiento.getUsuario().getIdUsuario());

        if (!apadrinamiento.isActivo()) {
            throw new ReglaDeNegocioException("El apadrinamiento ya fue cancelado");
        }
        return apadrinamiento;
    }

    // La llama el zarpar por cada animal pagado. Si el usuario ya apadrinaba a ese animal,
    // se le suman los cupos nuevos al que tenia (y pasa al plan nuevo); si no, se crea uno.
    @Override
    public Apadrinamiento registrar(Usuario usuario, Animal animal, Plan plan, int cupos, LocalDateTime fecha) {
        Optional<Apadrinamiento> existente = apadrinamientoRepository
                .findByUsuario_IdUsuarioAndAnimal_IdAnimalAndActivoTrue(usuario.getIdUsuario(), animal.getIdAnimal());

        Apadrinamiento apadrinamiento;
        if (existente.isPresent()) {
            apadrinamiento = existente.get();
            apadrinamiento.setCupos(apadrinamiento.getCupos() + cupos);
            apadrinamiento.setPlan(plan);
        } else {
            apadrinamiento = new Apadrinamiento();
            apadrinamiento.setUsuario(usuario);
            apadrinamiento.setAnimal(animal);
            apadrinamiento.setPlan(plan);
            apadrinamiento.setCupos(cupos);
            apadrinamiento.setFechaInicio(fecha);
            apadrinamiento.setActivo(true);
        }
        return apadrinamientoRepository.save(apadrinamiento);
    }
}
