package com.uade.tpo.SeaPlace.entity.dto;

import java.time.LocalDateTime;

import com.uade.tpo.SeaPlace.entity.ZarparDetalle;

import lombok.Data;

// Un pago hecho por un apadrinamiento: sale del renglon del zarpar donde se pago ese animal.
@Data
public class PagoResponse {
    private LocalDateTime fecha;
    private Double monto;

    public static PagoResponse fromEntity(ZarparDetalle detalle) {
        PagoResponse r = new PagoResponse();
        r.setFecha(detalle.getZarpar().getFechaZarpar());
        r.setMonto(detalle.getSubtotal());
        return r;
    }
}
