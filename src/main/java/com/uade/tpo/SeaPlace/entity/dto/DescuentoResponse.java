package com.uade.tpo.SeaPlace.entity.dto;

import java.time.LocalDate;

import com.uade.tpo.SeaPlace.entity.Descuento;

import lombok.Data;

@Data
public class DescuentoResponse {
    private Long idDescuento;
    private Long idAnimal;
    private Double porcentaje;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Boolean activo;

    public static DescuentoResponse fromEntity(Descuento descuento) {
        DescuentoResponse r = new DescuentoResponse();
        r.setIdDescuento(descuento.getIdDescuento());
        if (descuento.getAnimal() != null) {
            r.setIdAnimal(descuento.getAnimal().getIdAnimal());
        }
        r.setPorcentaje(descuento.getPorcentaje());
        r.setFechaInicio(descuento.getFechaInicio());
        r.setFechaFin(descuento.getFechaFin());
        r.setActivo(descuento.getActivo());
        return r;
    }
}
