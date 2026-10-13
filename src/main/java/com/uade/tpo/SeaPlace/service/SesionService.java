package com.uade.tpo.SeaPlace.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.uade.tpo.SeaPlace.entity.Animal;
import com.uade.tpo.SeaPlace.entity.Apadrinamiento;
import com.uade.tpo.SeaPlace.entity.Muelle;
import com.uade.tpo.SeaPlace.entity.Usuario;
import com.uade.tpo.SeaPlace.entity.dto.AnimalResponse;
import com.uade.tpo.SeaPlace.entity.dto.ApadrinamientoResponse;
import com.uade.tpo.SeaPlace.entity.dto.FavoritoResponse;
import com.uade.tpo.SeaPlace.entity.dto.MuelleDetalleResponse;
import com.uade.tpo.SeaPlace.entity.dto.NovedadResponse;
import com.uade.tpo.SeaPlace.entity.dto.PermisoResponse;
import com.uade.tpo.SeaPlace.entity.dto.RolResponse;
import com.uade.tpo.SeaPlace.entity.dto.SesionResponse;
import com.uade.tpo.SeaPlace.entity.dto.UbicacionAnimalResponse;
import com.uade.tpo.SeaPlace.entity.dto.UsuarioResponse;
import com.uade.tpo.SeaPlace.repository.NovedadRepository;
import com.uade.tpo.SeaPlace.repository.UbicacionAnimalRepository;

// Arma, para el usuario logueado, todo lo que el front necesita tener de el. Asi el front lo
// recibe en una sola respuesta (la de /inicio o la del login) en vez de pedir cada cosa aparte.
@Service
public class SesionService {

    private static final String ROL_REFUGIO = "duenioRefugio";
    private static final String ESTADO_PUBLICACION_PAUSADA = "PAUSADA";
    private static final String PERMISO_USUARIOS = "GESTIONAR_USUARIOS";
    private static final String PERMISO_ROLES = "GESTIONAR_ROLES";

    @Autowired
    private AutorizacionService autorizacionService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private FavoritoService favoritoService;

    @Autowired
    private MuelleService muelleService;

    @Autowired
    private ApadrinamientoService apadrinamientoService;

    @Autowired
    private AnimalService animalService;

    @Autowired
    private RolService rolService;

    @Autowired
    private PermisoService permisoService;

    @Autowired
    private NovedadRepository novedadRepository;

    @Autowired
    private UbicacionAnimalRepository ubicacionAnimalRepository;

    public SesionResponse armarSesion() {
        Usuario actual = autorizacionService.usuarioActual();
        boolean esAdmin = autorizacionService.esAdmin();
        boolean esRefugio = actual.getRol().getNombreRol().equalsIgnoreCase(ROL_REFUGIO);
        PageRequest todo = PageRequest.of(0, Integer.MAX_VALUE);

        SesionResponse sesion = new SesionResponse();
        sesion.setUsuario(UsuarioResponse.fromEntity(usuarioService.getMiPerfil()));
        sesion.setFavoritos(favoritoService.getFavoritos().stream().map(FavoritoResponse::fromEntity).toList());
        sesion.setApadrinamientos(getApadrinamientos());

        // Admin y refugio no apadrinan: no tienen muelle.
        if (!esAdmin && !esRefugio) {
            Muelle muelle = muelleService.getOrCreateMuelleActivo(actual.getIdUsuario());
            sesion.setIdMuelle(muelle.getIdMuelle());
            sesion.setItemsMuelle(muelleService.getItems(muelle.getIdMuelle()).stream().map(MuelleDetalleResponse::fromEntity).toList());
        }

        if (esAdmin || actual.getRefugio() != null) {
            sesion.setPausados(animalService.getAnimales(ESTADO_PUBLICACION_PAUSADA, null, null, null, null, null, todo)
                    .map(AnimalResponse::fromEntity).getContent());
        }

        // Las mismas reglas que protegen /usuarios, /roles y /permisos en SecurityConfig.
        if (tienePermiso(actual, PERMISO_USUARIOS)) {
            sesion.setUsuarios(usuarioService.getUsuarios(todo).map(UsuarioResponse::fromEntity).getContent());
        }
        if (tienePermiso(actual, PERMISO_ROLES)) {
            sesion.setRoles(rolService.getRoles().stream().map(RolResponse::fromEntity).toList());
            sesion.setPermisos(permisoService.getPermisos().stream().map(PermisoResponse::fromEntity).toList());
        }
        return sesion;
    }

    // Los apadrinamientos que le corresponden al usuario logueado, listos para responder.
    public List<ApadrinamientoResponse> getApadrinamientos() {
        return apadrinamientoService.getApadrinamientos().stream().map(this::aRespuesta).toList();
    }

    // Un apadrinamiento con sus pagos y con la bitacora y la ultima ubicacion de su animal,
    // para que el cliente no tenga que pedirlas aparte.
    public ApadrinamientoResponse aRespuesta(Apadrinamiento apadrinamiento) {
        ApadrinamientoResponse r = ApadrinamientoResponse.fromEntity(apadrinamiento, apadrinamientoService.getPagos(apadrinamiento));

        Animal animal = apadrinamiento.getAnimal();
        // La misma regla que /animales/{id}/novedades y /ubicaciones: solo si puede ver la publicacion.
        if (animal != null && autorizacionService.puedeVerAnimal(animal)) {
            r.setNovedades(novedadRepository.findByAnimal_IdAnimalOrderByFechaDesc(animal.getIdAnimal())
                    .stream().map(NovedadResponse::fromEntity).toList());
            r.setUltimaUbicacion(ubicacionAnimalRepository.findTopByAnimal_IdAnimalOrderByFechaHoraDesc(animal.getIdAnimal())
                    .map(UbicacionAnimalResponse::fromEntity).orElse(null));
        }
        return r;
    }

    private boolean tienePermiso(Usuario usuario, String permiso) {
        return usuario.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(permiso));
    }
}
