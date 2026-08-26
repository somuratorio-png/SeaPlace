package com.uade.tpo.SeaPlace.entity.dto;

import com.uade.tpo.SeaPlace.entity.CompraDetalle;

import lombok.Data;

@Data
public class CompraDetalleResponse {
    private Long idCompraDetalle;
    private Long idAnimal;
    private String nombreAnimal;
    private Integer cantidad;
    private Double precioUnitario;
    private Double subtotal;

    public static CompraDetalleResponse fromEntity(CompraDetalle detalle) {
        CompraDetalleResponse r = new CompraDetalleResponse();
        r.setIdCompraDetalle(detalle.getIdCompraDetalle());
        if (detalle.getAnimal() != null) {
            r.setIdAnimal(detalle.getAnimal().getIdAnimal());
            r.setNombreAnimal(detalle.getAnimal().getNombreAnimal());
        }
        r.setCantidad(detalle.getCantidad());
        r.setPrecioUnitario(detalle.getPrecioUnitario());
        r.setSubtotal(detalle.getSubtotal());
        return r;
    }
}
