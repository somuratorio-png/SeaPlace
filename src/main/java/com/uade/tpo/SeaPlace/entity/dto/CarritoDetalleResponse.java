package com.uade.tpo.SeaPlace.entity.dto;

import com.uade.tpo.SeaPlace.entity.CarritoDetalle;

import lombok.Data;

@Data
public class CarritoDetalleResponse {
    private Long idCarritoDetalle;
    private Long idCarrito;
    private Long idAnimal;
    private String nombreAnimal;
    private Integer cantidad;
    private Double precioUnitario;

    public static CarritoDetalleResponse fromEntity(CarritoDetalle detalle) {
        CarritoDetalleResponse r = new CarritoDetalleResponse();
        r.setIdCarritoDetalle(detalle.getIdCarritoDetalle());
        if (detalle.getCarrito() != null) {
            r.setIdCarrito(detalle.getCarrito().getIdCarrito());
        }
        if (detalle.getAnimal() != null) {
            r.setIdAnimal(detalle.getAnimal().getIdAnimal());
            r.setNombreAnimal(detalle.getAnimal().getNombreAnimal());
        }
        r.setCantidad(detalle.getCantidad());
        r.setPrecioUnitario(detalle.getPrecioUnitario());
        return r;
    }
}
