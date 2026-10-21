package com.uade.tpo.SeaPlace.entity.dto;

import lombok.Data;

@Data
public class AnimalUpdateRequest {
    private Long idCategoria;
    private String nombreAnimal;
    private String descripcion;
    private Double cuotaApadrinamiento;
    private Double precioBrisaMarina;
    private Double precioMareaProfunda;
    private Integer cuposTotales;
    private String estado;
    private String especie;
    private String edad;
    private String ubicacion;
    private String urgencia;
    private String condicion;
    private Boolean destacado;
}
