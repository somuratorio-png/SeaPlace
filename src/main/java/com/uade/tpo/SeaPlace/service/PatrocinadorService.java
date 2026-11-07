package com.uade.tpo.SeaPlace.service;

import java.util.List;

import com.uade.tpo.SeaPlace.entity.Patrocinador;
import com.uade.tpo.SeaPlace.entity.Usuario;
import com.uade.tpo.SeaPlace.entity.ZarparDetalle;
import com.uade.tpo.SeaPlace.entity.dto.BeneficioResponse;
import com.uade.tpo.SeaPlace.entity.dto.CampaniaRequest;
import com.uade.tpo.SeaPlace.entity.dto.MiPatrocinioResponse;
import com.uade.tpo.SeaPlace.entity.dto.PatrocinadorPerfilRequest;
import com.uade.tpo.SeaPlace.entity.dto.PatrocinadorResponse;

public interface PatrocinadorService {

    // Publico: todos los patrocinadores, del que mas se comprometio al que menos
    List<PatrocinadorResponse> getPatrocinadores();

    // Los beneficios con su cupon: solo para quien apadrina hoy algun animal
    List<BeneficioResponse> getBeneficios();

    // Lo del panel del patrocinador logueado
    MiPatrocinioResponse getMiPatrocinio();

    MiPatrocinioResponse modificarMiPerfil(PatrocinadorPerfilRequest request);

    MiPatrocinioResponse crearCampania(CampaniaRequest request);

    MiPatrocinioResponse finalizarCampania(Long campaniaId);

    // Lo usa el registro: crea el patrocinador de una cuenta nueva
    Patrocinador crearPatrocinador(Usuario usuario, String nombreEmpresa);

    // Lo usa el zarpar: si el animal tiene una campaña vigente, el patrocinador duplica el renglon
    // (hasta lo que le quede de tope) y queda anotado en el detalle
    void duplicar(ZarparDetalle detalle);
}
