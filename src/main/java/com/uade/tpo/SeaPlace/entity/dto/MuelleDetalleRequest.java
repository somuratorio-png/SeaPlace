package com.uade.tpo.SeaPlace.entity.dto;

import lombok.Data;

@Data
public class MuelleDetalleRequest {
    private Long idMuelle;
    private Long idAnimal;
    private Integer cantidad;
    // precioUnitario lo toma el service de Animal.cuotaApadrinamiento, no lo manda el cliente
}
