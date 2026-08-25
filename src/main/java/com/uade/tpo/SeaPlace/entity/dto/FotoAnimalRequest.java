package com.uade.tpo.SeaPlace.entity.dto;

import lombok.Data;

@Data
public class FotoAnimalRequest {
    private Long idAnimal;
    private String urlImagen;
    private Integer orden;
}
