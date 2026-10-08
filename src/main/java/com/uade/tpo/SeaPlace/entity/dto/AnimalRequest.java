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
    // Datos opcionales de la ficha
    private String especie;
    private String edad;
    private String ubicacion;
    private String urgencia; // CRITICO, RECUPERACION o LISTO
    private String condicion;
    // cuposDisponibles, fechaPublicacion y estado los setea el service
}