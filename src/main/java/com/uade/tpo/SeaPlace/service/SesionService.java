package com.uade.tpo.SeaPlace.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.SeaPlace.entity.Animal;
import com.uade.tpo.SeaPlace.entity.Apadrinamiento;
import com.uade.tpo.SeaPlace.entity.Muelle;
import com.uade.tpo.SeaPlace.entity.Usuario;
import com.uade.tpo.SeaPlace.entity.dto.ApadrinamientoResponse;
import com.uade.tpo.SeaPlace.entity.dto.FavoritoResponse;
import com.uade.tpo.SeaPlace.entity.dto.MuelleDetalleResponse;
import com.uade.tpo.SeaPlace.entity.dto.NovedadResponse;
import com.uade.tpo.SeaPlace.entity.dto.SesionResponse;
import com.uade.tpo.SeaPlace.entity.dto.UbicacionAnimalResponse;
import com.uade.tpo.SeaPlace.entity.dto.UsuarioResponse;
import com.uade.tpo.SeaPlace.repository.NovedadRepository;
import com.uade.tpo.SeaPlace.repository.UbicacionAnimalRepository;

@Service
public class SesionService {

    private static final String ROL_REFUGIO = "duenioRefugio";

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
    private NovedadRepository novedadRepository;

    @Autowired
    private UbicacionAnimalRepository ubicacionAnimalRepository;

    public SesionResponse armarSesion() {
        Usuario actual = autorizacionService.usuarioActual();
        boolean esRefugio = actual.getRol().getNombreRol().equalsIgnoreCase(ROL_REFUGIO);

        SesionResponse sesion = new SesionResponse();
        sesion.setUsuario(UsuarioResponse.fromEntity(usuarioService.getMiPerfil()));
        sesion.setFavoritos(favoritoService.getFavoritos().stream().map(FavoritoResponse::fromEntity).toList());

        if (!autorizacionService.esAdmin() && !esRefugio) {
            Muelle muelle = muelleService.getOrCreateMuelleActivo(actual.getIdUsuario());
            sesion.setIdMuelle(muelle.getIdMuelle());
            sesion.setItemsMuelle(muelleService.getItems(muelle.getIdMuelle()).stream().map(MuelleDetalleResponse::fromEntity).toList());
        }
        return sesion;
    }

    public List<ApadrinamientoResponse> getApadrinamientos() {
        return apadrinamientoService.getApadrinamientos().stream().map(this::aRespuesta).toList();
    }

    public ApadrinamientoResponse aRespuesta(Apadrinamiento apadrinamiento) {
        ApadrinamientoResponse r = ApadrinamientoResponse.fromEntity(apadrinamiento, apadrinamientoService.getPagos(apadrinamiento));

        Animal animal = apadrinamiento.getAnimal();
        if (animal != null && autorizacionService.puedeVerAnimal(animal)) {
            r.setNovedades(novedadRepository.findByAnimal_IdAnimalOrderByFechaDesc(animal.getIdAnimal())
                    .stream().map(NovedadResponse::fromEntity).toList());
            r.setUltimaUbicacion(ubicacionAnimalRepository.findTopByAnimal_IdAnimalOrderByFechaHoraDesc(animal.getIdAnimal())
                    .map(UbicacionAnimalResponse::fromEntity).orElse(null));
        }
        return r;
    }
}
