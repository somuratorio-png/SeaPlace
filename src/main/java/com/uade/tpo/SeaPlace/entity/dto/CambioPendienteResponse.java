package com.uade.tpo.SeaPlace.entity.dto;

import lombok.Data;

@Data
public class CambioPendienteResponse {
    private AnimalResponse animal;
    private AnimalUpdateRequest cambio;
    private String nombreCategoriaPropuesta;
}
