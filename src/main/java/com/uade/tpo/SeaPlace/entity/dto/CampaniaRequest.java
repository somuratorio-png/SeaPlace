package com.uade.tpo.SeaPlace.entity.dto;

import java.time.LocalDate;

import lombok.Data;

// Una campaña nueva: a que animal, hasta cuanto duplica (en dolares) y hasta cuando.
// Empieza el dia que se crea.
@Data
public class CampaniaRequest {
    private Long idAnimal;
    private Double tope;
    private LocalDate fechaFin;
}
