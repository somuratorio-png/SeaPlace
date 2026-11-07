package com.uade.tpo.SeaPlace.service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.SeaPlace.entity.Animal;
import com.uade.tpo.SeaPlace.entity.Campania;
import com.uade.tpo.SeaPlace.entity.Patrocinador;
import com.uade.tpo.SeaPlace.entity.Refugio;
import com.uade.tpo.SeaPlace.entity.TemaNotificacion;
import com.uade.tpo.SeaPlace.entity.Usuario;
import com.uade.tpo.SeaPlace.entity.ZarparDetalle;
import com.uade.tpo.SeaPlace.entity.dto.BeneficioResponse;
import com.uade.tpo.SeaPlace.entity.dto.CampaniaRequest;
import com.uade.tpo.SeaPlace.entity.dto.CampaniaResponse;
import com.uade.tpo.SeaPlace.entity.dto.MiPatrocinioResponse;
import com.uade.tpo.SeaPlace.entity.dto.PatrocinadorPerfilRequest;
import com.uade.tpo.SeaPlace.entity.dto.PatrocinadorResponse;
import com.uade.tpo.SeaPlace.exceptions.RecursoDuplicadoException;
import com.uade.tpo.SeaPlace.exceptions.RecursoNoEncontradoException;
import com.uade.tpo.SeaPlace.exceptions.ReglaDeNegocioException;
import com.uade.tpo.SeaPlace.repository.AnimalRepository;
import com.uade.tpo.SeaPlace.repository.ApadrinamientoRepository;
import com.uade.tpo.SeaPlace.repository.CampaniaRepository;
import com.uade.tpo.SeaPlace.repository.PatrocinadorRepository;
import com.uade.tpo.SeaPlace.repository.ZarparDetalleRepository;

@Service
public class PatrocinadorServiceImpl implements PatrocinadorService {

    private static final String PUBLICACION_ACTIVA = "ACTIVA";
    private static final double TOPE_MINIMO = 50;
    private static final double TOPE_MAXIMO = 100000;
    private static final int MESES_MAXIMOS = 12;

    @Autowired
    private PatrocinadorRepository patrocinadorRepository;

    @Autowired
    private CampaniaRepository campaniaRepository;

    @Autowired
    private ZarparDetalleRepository zarparDetalleRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private ApadrinamientoRepository apadrinamientoRepository;

    @Autowired
    private AutorizacionService autorizacionService;

    @Autowired
    private NotificacionService notificacionService;

    @Override
    public List<PatrocinadorResponse> getPatrocinadores() {
        return patrocinadorRepository.findAll().stream()
                .map(this::aRespuesta)
                .sorted(Comparator.comparingDouble(PatrocinadorResponse::getComprometido).reversed())
                .toList();
    }

    @Override
    public List<BeneficioResponse> getBeneficios() {
        Usuario actual = autorizacionService.usuarioActual();
        boolean apadrinaAlguno = apadrinamientoRepository.findByUsuario_IdUsuario(actual.getIdUsuario()).stream()
                .anyMatch(apadrinamiento -> apadrinamiento.isActivo());
        if (!apadrinaAlguno && !autorizacionService.esAdmin()) {
            throw new AccessDeniedException("Los beneficios de los patrocinadores son para quienes apadrinan un animal");
        }
        return patrocinadorRepository.findAll().stream()
                .filter(patrocinador -> patrocinador.getBeneficio() != null && !patrocinador.getBeneficio().isBlank())
                .map(BeneficioResponse::fromEntity)
                .toList();
    }

    @Override
    public MiPatrocinioResponse getMiPatrocinio() {
        return armarMiPatrocinio(miPatrocinador());
    }

    @Override
    public MiPatrocinioResponse modificarMiPerfil(PatrocinadorPerfilRequest request) {
        Patrocinador patrocinador = miPatrocinador();
        patrocinador.setDescripcion(opcional(request.getDescripcion(), 500, "La descripcion"));
        patrocinador.setSitioWeb(opcional(request.getSitioWeb(), 255, "El sitio web"));
        patrocinador.setBeneficio(opcional(request.getBeneficio(), 300, "El beneficio"));
        patrocinador.setCupon(opcional(request.getCupon(), 255, "El cupon"));
        String icono = opcional(request.getIcono(), 60, "El icono");
        patrocinador.setIcono(icono == null ? "storefront" : icono);

        // Un beneficio sin codigo no sirve: el padrino no tendria como usarlo
        if (patrocinador.getBeneficio() != null && patrocinador.getCupon() == null) {
            throw new ReglaDeNegocioException("Si ofreces un beneficio, indica tambien el cupon para usarlo");
        }
        return armarMiPatrocinio(patrocinadorRepository.save(patrocinador));
    }

    @Override
    public MiPatrocinioResponse crearCampania(CampaniaRequest request) {
        Patrocinador patrocinador = miPatrocinador();

        if (request.getIdAnimal() == null) {
            throw new ReglaDeNegocioException("Elegi el animal de la campaña");
        }
        Animal animal = animalRepository.findById(request.getIdAnimal())
                .filter(a -> PUBLICACION_ACTIVA.equals(a.getEstado()))
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe un animal publicado con id " + request.getIdAnimal()));

        Double tope = request.getTope();
        if (tope == null || tope < TOPE_MINIMO || tope > TOPE_MAXIMO) {
            throw new ReglaDeNegocioException("El tope tiene que estar entre US$ " + (int) TOPE_MINIMO + " y US$ " + (int) TOPE_MAXIMO);
        }

        LocalDate hoy = LocalDate.now();
        LocalDate fechaFin = request.getFechaFin();
        if (fechaFin == null || !fechaFin.isAfter(hoy)) {
            throw new ReglaDeNegocioException("La campaña tiene que terminar despues de hoy");
        }
        if (fechaFin.isAfter(hoy.plusMonths(MESES_MAXIMOS))) {
            throw new ReglaDeNegocioException("Una campaña puede durar hasta " + MESES_MAXIMOS + " meses");
        }

        // Un animal tiene a lo sumo una campaña en curso (pendiente o aceptada): si no, no se sabria quien duplica
        campaniaRepository.findByAnimal_IdAnimalAndActivaTrue(animal.getIdAnimal()).stream()
                .filter(otra -> otra.ocupaAnimal(hoy))
                .findFirst()
                .ifPresent(otra -> {
                    throw new RecursoDuplicadoException(animal.getNombreAnimal() + " ya tiene una campaña de duplicacion en curso de "
                            + otra.getPatrocinador().getNombreEmpresa());
                });

        Campania campania = new Campania();
        campania.setPatrocinador(patrocinador);
        campania.setAnimal(animal);
        campania.setTope(Math.round(tope * 100.0) / 100.0);
        campania.setAportado(0.0);
        campania.setFechaInicio(hoy);
        campania.setFechaFin(fechaFin);
        campania.setActiva(true);
        // No duplica hasta que el refugio la acepte
        campania.setEstado(Campania.PENDIENTE);
        campaniaRepository.save(campania);

        Usuario dueno = animal.getRefugio().getUsuario();
        if (dueno != null) {
            notificacionService.notificar(dueno, TemaNotificacion.PATROCINIOS, patrocinador.getNombreEmpresa()
                    + " quiere duplicar los aportes para " + animal.getNombreAnimal() + " hasta US$ " + campania.getTope()
                    + ". Aceptala o rechazala en la sección Patrocinios.");
        }
        return armarMiPatrocinio(patrocinador);
    }

    @Override
    public List<CampaniaResponse> getCampaniasDeMiRefugio() {
        if (autorizacionService.esAdmin()) {
            return campaniaRepository.findAll().stream()
                    .sorted(Comparator.comparing(Campania::getIdCampania).reversed())
                    .map(CampaniaResponse::fromEntity).toList();
        }
        Refugio refugio = autorizacionService.usuarioActual().getRefugio();
        if (refugio == null) {
            throw new AccessDeniedException("Solo un refugio ve las campañas de sus animales");
        }
        return campaniaRepository.findByAnimal_Refugio_IdRefugioOrderByIdCampaniaDesc(refugio.getIdRefugio()).stream()
                .map(CampaniaResponse::fromEntity).toList();
    }

    @Override
    public CampaniaResponse aceptarCampania(Long campaniaId) {
        Campania campania = pendienteDeMiRefugio(campaniaId);
        LocalDate hoy = LocalDate.now();
        if (hoy.isAfter(campania.getFechaFin())) {
            throw new ReglaDeNegocioException("La campaña ya vencio: no se puede aceptar");
        }
        // Empieza a duplicar desde hoy
        campania.setEstado(Campania.ACEPTADA);
        campania.setFechaInicio(hoy);
        campaniaRepository.save(campania);

        notificacionService.notificar(campania.getPatrocinador().getUsuario(), TemaNotificacion.PATROCINIOS,
                campania.getAnimal().getRefugio().getNombreRefugio() + " aceptó tu campaña para " + campania.getAnimal().getNombreAnimal()
                        + ": desde hoy se duplican los aportes de sus padrinos.");
        return CampaniaResponse.fromEntity(campania);
    }

    @Override
    public CampaniaResponse rechazarCampania(Long campaniaId, String motivoCrudo) {
        Campania campania = pendienteDeMiRefugio(campaniaId);
        String motivo = opcional(motivoCrudo, 300, "El motivo");
        campania.setEstado(Campania.RECHAZADA);
        campania.setMotivoRechazo(motivo);
        campania.setActiva(false);
        campaniaRepository.save(campania);

        String texto = campania.getAnimal().getRefugio().getNombreRefugio() + " rechazó tu campaña para " + campania.getAnimal().getNombreAnimal() + ".";
        if (motivo != null) {
            texto += " Motivo: " + motivo;
        }
        notificacionService.notificar(campania.getPatrocinador().getUsuario(), TemaNotificacion.PATROCINIOS, texto);
        return CampaniaResponse.fromEntity(campania);
    }

    // Una campaña que espera respuesta, sobre un animal del refugio logueado (o cualquiera, si es admin)
    private Campania pendienteDeMiRefugio(Long campaniaId) {
        Campania campania = campaniaRepository.findById(campaniaId)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la campaña con id " + campaniaId));
        autorizacionService.validarPermisoSobreRefugio(campania.getAnimal().getRefugio().getIdRefugio());
        if (!campania.isActiva() || !Campania.PENDIENTE.equals(campania.getEstado())) {
            throw new ReglaDeNegocioException("La campaña ya fue respondida o el patrocinador la retiró");
        }
        return campania;
    }

    @Override
    public MiPatrocinioResponse finalizarCampania(Long campaniaId) {
        Patrocinador patrocinador = miPatrocinador();
        Campania campania = campaniaRepository.findById(campaniaId)
                .filter(c -> c.getPatrocinador().getIdPatrocinador().equals(patrocinador.getIdPatrocinador()))
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la campaña con id " + campaniaId));

        if (!campania.isActiva()) {
            throw new ReglaDeNegocioException("La campaña ya estaba terminada");
        }
        // No se borra: lo que ya se duplico queda en el historial y en el impacto
        campania.setActiva(false);
        campaniaRepository.save(campania);
        return armarMiPatrocinio(patrocinador);
    }

    @Override
    public Patrocinador crearPatrocinador(Usuario usuario, String nombreEmpresaCrudo) {
        String nombreEmpresa = nombreEmpresaCrudo == null ? "" : nombreEmpresaCrudo.trim();
        if (nombreEmpresa.isEmpty()) {
            throw new ReglaDeNegocioException("El nombre de la empresa es obligatorio");
        }
        if (patrocinadorRepository.existsByNombreEmpresaIgnoreCase(nombreEmpresa)) {
            throw new RecursoDuplicadoException("Ya hay un patrocinador llamado " + nombreEmpresa);
        }
        Patrocinador patrocinador = new Patrocinador();
        patrocinador.setUsuario(usuario);
        patrocinador.setNombreEmpresa(nombreEmpresa);
        patrocinador.setIcono("storefront");
        return patrocinadorRepository.save(patrocinador);
    }

    @Override
    @Transactional
    public void duplicar(ZarparDetalle detalle) {
        campaniaVigente(detalle.getAnimal()).ifPresent(campania -> {
            double aporte = Math.min(detalle.getSubtotal(), campania.restante());
            aporte = Math.round(aporte * 100.0) / 100.0;
            campania.setAportado(Math.round((campania.getAportado() + aporte) * 100.0) / 100.0);
            campaniaRepository.save(campania);
            detalle.setCampania(campania);
            detalle.setAportePatrocinador(aporte);
        });
    }

    // ---------- Auxiliares ----------

    // El patrocinador de quien esta logueado; si la cuenta no es de un patrocinador, no puede seguir
    private Patrocinador miPatrocinador() {
        return patrocinadorRepository.findByUsuario_IdUsuario(autorizacionService.idUsuarioActual())
                .orElseThrow(() -> new AccessDeniedException("Tu cuenta no es de un patrocinador"));
    }

    private Optional<Campania> campaniaVigente(Animal animal) {
        LocalDate hoy = LocalDate.now();
        return campaniaRepository.findByAnimal_IdAnimalAndActivaTrue(animal.getIdAnimal()).stream()
                .filter(campania -> campania.estaVigente(hoy))
                .findFirst();
    }

    private PatrocinadorResponse aRespuesta(Patrocinador patrocinador) {
        List<Campania> campanias = campaniaRepository.findByPatrocinador_IdPatrocinador(patrocinador.getIdPatrocinador());
        double comprometido = campanias.stream().mapToDouble(Campania::getTope).sum();
        double aportado = campanias.stream().mapToDouble(Campania::getAportado).sum();
        int animales = (int) campanias.stream().map(c -> c.getAnimal().getIdAnimal()).distinct().count();
        return PatrocinadorResponse.fromEntity(patrocinador, redondear(comprometido), redondear(aportado), animales);
    }

    private MiPatrocinioResponse armarMiPatrocinio(Patrocinador patrocinador) {
        MiPatrocinioResponse r = new MiPatrocinioResponse();
        r.setPatrocinador(aRespuesta(patrocinador));
        r.setCupon(patrocinador.getCupon());
        r.setCampanias(campaniaRepository
                .findByPatrocinador_IdPatrocinadorOrderByFechaInicioDescIdCampaniaDesc(patrocinador.getIdPatrocinador())
                .stream().map(CampaniaResponse::fromEntity).toList());

        List<ZarparDetalle> duplicados = zarparDetalleRepository.findByCampania_Patrocinador_IdPatrocinador(patrocinador.getIdPatrocinador());
        double dePadrinos = duplicados.stream().mapToDouble(ZarparDetalle::getSubtotal).sum();
        double delPatrocinador = duplicados.stream().map(ZarparDetalle::getAportePatrocinador).filter(Objects::nonNull).mapToDouble(Double::doubleValue).sum();
        r.setPlataMovilizada(redondear(dePadrinos + delPatrocinador));
        r.setPadrinosAlcanzados((int) duplicados.stream().map(d -> d.getZarpar().getUsuario().getIdUsuario()).distinct().count());
        r.setAportesDuplicados(duplicados.size());
        return r;
    }

    // Un texto opcional: vacio queda en null; si es muy largo, error
    private static String opcional(String valor, int largoMaximo, String campo) {
        if (valor == null || valor.isBlank()) {
            return null;
        }
        String limpio = valor.trim();
        if (limpio.length() > largoMaximo) {
            throw new ReglaDeNegocioException(campo + " no puede superar los " + largoMaximo + " caracteres");
        }
        return limpio;
    }

    private static double redondear(double valor) {
        return Math.round(valor * 100.0) / 100.0;
    }
}
