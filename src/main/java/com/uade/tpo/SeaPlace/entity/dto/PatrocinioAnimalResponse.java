package com.uade.tpo.SeaPlace.entity.dto;

import java.time.LocalDate;

import com.uade.tpo.SeaPlace.entity.Campania;

import lombok.Data;

// La campaña que hoy duplica los aportes para un animal: va dentro de AnimalResponse
// para mostrar el sello "Patrocinado por ..." en la tarjeta y en la ficha.
@Data
public class PatrocinioAnimalResponse {
    private Long idCampania;
    private String nombreEmpresa;
    private String icono;
    private double tope;
    private double restante;
    private LocalDate fechaFin;

    public static PatrocinioAnimalResponse fromEntity(Campania campania) {
        PatrocinioAnimalResponse r = new PatrocinioAnimalResponse();
        r.setIdCampania(campania.getIdCampania());
        r.setNombreEmpresa(campania.getPatrocinador().getNombreEmpresa());
        r.setIcono(campania.getPatrocinador().getIcono());
        r.setTope(campania.getTope());
        r.setRestante(campania.restante());
        r.setFechaFin(campania.getFechaFin());
        return r;
    }
}
