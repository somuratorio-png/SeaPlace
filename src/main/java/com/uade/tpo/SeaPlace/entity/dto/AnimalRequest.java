package com.uade.tpo.SeaPlace.entity.dto;

import lombok.Data;

@Data
public class AnimalRequest {
    private Long idCategoria;
    private Long idRefugio;
    private String nombreAnimal;
    private Double cuotaApadrinamiento;
    private Integer cuposTotales;
    private String descripcion;
    // cuposDisponibles, fechaPublicacion y estado los setea el service
}