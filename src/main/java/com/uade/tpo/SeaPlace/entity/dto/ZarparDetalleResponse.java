package com.uade.tpo.SeaPlace.entity.dto;

import com.uade.tpo.SeaPlace.entity.ZarparDetalle;

import lombok.Data;

@Data
public class ZarparDetalleResponse {
    private Long idZarparDetalle;
    private Long idAnimal;
    private String nombreAnimal;
    private Integer cantidad;
    private Double precioUnitario;
    private Double subtotal;

    public static ZarparDetalleResponse fromEntity(ZarparDetalle detalle) {
        ZarparDetalleResponse r = new ZarparDetalleResponse();
        r.setIdZarparDetalle(detalle.getIdZarparDetalle());
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
