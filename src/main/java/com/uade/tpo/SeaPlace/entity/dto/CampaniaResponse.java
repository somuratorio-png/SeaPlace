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
    // true si hoy esta duplicando aportes (activa, en fecha, con tope y con el animal publicado)
    private boolean vigente;

    public static CampaniaResponse fromEntity(Campania campania) {
        CampaniaResponse r = new CampaniaResponse();
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
