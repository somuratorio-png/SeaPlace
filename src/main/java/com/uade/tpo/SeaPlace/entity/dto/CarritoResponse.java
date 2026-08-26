package com.uade.tpo.SeaPlace.entity.dto;

import java.time.LocalDateTime;

import com.uade.tpo.SeaPlace.entity.Carrito;

import lombok.Data;

@Data
public class CarritoResponse {
    private Long idCarrito;
    private Long idUsuario;
    private LocalDateTime fechaCreacion;
    private String estado;

    public static CarritoResponse fromEntity(Carrito carrito) {
        CarritoResponse r = new CarritoResponse();
        r.setIdCarrito(carrito.getIdCarrito());
        if (carrito.getUsuario() != null) {
            r.setIdUsuario(carrito.getUsuario().getIdUsuario());
        }
        r.setFechaCreacion(carrito.getFechaCreacion());
        r.setEstado(carrito.getEstado());
        return r;
    }
}
