package com.uade.tpo.SeaPlace.entity.dto;

import lombok.Data;

@Data
public class AnimalRequest {
    private Long idCategoria;
    private Long idRefugio;
    private String nombreAnimal;
    private Double cuotaApadrinamiento;
    private Double precioBrisaMarina;
    private Double precioMareaProfunda;
    private Integer cuposTotales;
    private String descripcion;
    private String especie;
    private String edad;
    private String ubicacion;
    private String urgencia;
    private String condicion;
}