package com.uade.tpo.SeaPlace.entity.dto;

import lombok.Data;

@Data
public class UbicacionAnimalRequest {
    private Long idAnimal;
    private Double latitud;
    private Double longitud;
    // fechaHora la setea el service (LocalDateTime.now())
}