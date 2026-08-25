package com.uade.tpo.SeaPlace.entity.dto;

import lombok.Data;

@Data
public class CarritoDetalleRequest {
    private Long idCarrito;
    private Long idAnimal;
    private Integer cantidad;
    // precioUnitario lo toma el service de Animal.cuotaApadrinamiento, no lo manda el cliente
}
