package com.uade.tpo.SeaPlace.entity.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class DescuentoRequest {
    private Long idAnimal;
    private Double porcentaje;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    // activo lo setea el service (true por defecto)
}