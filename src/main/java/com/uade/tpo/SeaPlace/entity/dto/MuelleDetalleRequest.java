package com.uade.tpo.SeaPlace.entity.dto;

import lombok.Data;

@Data
public class MuelleDetalleRequest {
    private Long idMuelle;
    private Long idAnimal;
    private Integer cantidad;
    private String plan;
}
