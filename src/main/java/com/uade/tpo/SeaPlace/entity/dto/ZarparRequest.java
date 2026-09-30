// Se genera a partir de un Carrito existente, no se cargan ids de animal a mano
package com.uade.tpo.SeaPlace.entity.dto;

import lombok.Data;

@Data
public class ZarparRequest {
    private Long idUsuario;
    private Long idMuelle;
    // fechaCompra, total, estado y el detalle los arma el service en base al Carrito
}