// Se genera a partir de un Carrito existente, no se cargan ids de animal a mano
package com.uade.tpo.SeaPlace.entity.dto;

import lombok.Data;

@Data
public class CompraRequest {
    private Long idUsuario;
    private Long idCarrito;
    // fechaCompra, total, estado y el detalle los arma el service en base al Carrito
}