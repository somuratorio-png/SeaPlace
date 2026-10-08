package com.uade.tpo.SeaPlace.entity.dto;

import lombok.Data;

// Los campos en null se ignoran; solo se actualiza lo que viene informado.
@Data
public class AnimalUpdateRequest {
    private String nombreAnimal;
    private String descripcion;
    private Double cuotaApadrinamiento;
    private Integer cuposTotales;
    private String estado;
    private String especie;
    private String edad;
    private String ubicacion;
    private String urgencia;
    private String condicion;
    private Boolean destacado; // solo lo puede cambiar un administrador
}
