package com.uade.tpo.SeaPlace.entity.dto;

import java.time.LocalDateTime;

import com.uade.tpo.SeaPlace.entity.Novedad;

import lombok.Data;

@Data
public class NovedadResponse {
    private Long idNovedad;
    private Long idAnimal;
    private String texto;
    private LocalDateTime fecha;

    public static NovedadResponse fromEntity(Novedad novedad) {
        NovedadResponse r = new NovedadResponse();
        r.setIdNovedad(novedad.getIdNovedad());
        if (novedad.getAnimal() != null) {
            r.setIdAnimal(novedad.getAnimal().getIdAnimal());
        }
        r.setTexto(novedad.getTexto());
        r.setFecha(novedad.getFecha());
        return r;
    }
}
