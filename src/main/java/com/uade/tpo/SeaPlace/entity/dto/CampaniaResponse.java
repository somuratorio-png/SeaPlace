package com.uade.tpo.SeaPlace.entity.dto;

import java.time.LocalDate;

import com.uade.tpo.SeaPlace.entity.Campania;

import lombok.Data;

@Data
public class CampaniaResponse {
    private Long idCampania;
    private Long idAnimal;
    private String nombreAnimal;
    private double tope;
    private double aportado;
    private double restante;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private boolean activa;
    // true si hoy esta duplicando aportes (aceptada, activa, en fecha, con tope y con el animal publicado)
    private boolean vigente;
    // PENDIENTE (espera al refugio), ACEPTADA o RECHAZADA, y lo que escribio el refugio si la rechazo
    private String estado;
    private String motivoRechazo;
    // Quien la propone: para que el refugio sepa con quien acepta trabajar
    private String nombreEmpresa;
    private String iconoEmpresa;
    private String descripcionEmpresa;

    public static CampaniaResponse fromEntity(Campania campania) {
        CampaniaResponse r = new CampaniaResponse();
        r.setEstado(campania.getEstado());
        r.setMotivoRechazo(campania.getMotivoRechazo());
        r.setNombreEmpresa(campania.getPatrocinador().getNombreEmpresa());
        r.setIconoEmpresa(campania.getPatrocinador().getIcono());
        r.setDescripcionEmpresa(campania.getPatrocinador().getDescripcion());
        r.setIdCampania(campania.getIdCampania());
        r.setIdAnimal(campania.getAnimal().getIdAnimal());
        r.setNombreAnimal(campania.getAnimal().getNombreAnimal());
        r.setTope(campania.getTope());
        r.setAportado(campania.getAportado());
        r.setRestante(campania.restante());
        r.setFechaInicio(campania.getFechaInicio());
        r.setFechaFin(campania.getFechaFin());
        r.setActiva(campania.isActiva());
        r.setVigente(campania.estaVigente(LocalDate.now()));
        return r;
    }
}
