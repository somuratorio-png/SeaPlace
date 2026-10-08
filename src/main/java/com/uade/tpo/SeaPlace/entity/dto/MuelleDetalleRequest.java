package com.uade.tpo.SeaPlace.entity.dto;

import lombok.Data;

@Data
public class MuelleDetalleRequest {
    private Long idMuelle;
    private Long idAnimal;
    private Integer cantidad;
    // Nivel de apadrinamiento (BRISA_MARINA, GUARDIAN_DE_LA_BAHIA o MAREA_PROFUNDA). Es opcional.
    private String plan;
    // precioUnitario lo toma el service de Animal.cuotaApadrinamiento, no lo manda el cliente
}
