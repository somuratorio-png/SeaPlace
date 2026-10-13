package com.uade.tpo.SeaPlace.entity.dto;

import java.time.LocalDateTime;

import com.uade.tpo.SeaPlace.entity.ZarparDetalle;

import lombok.Data;

// Un pago hecho por un apadrinamiento: sale del renglon del zarpar donde se pago ese animal.
@Data
public class PagoResponse {
    // El id del renglon del zarpar: identifica al pago.
    private Long idPago;
    private LocalDateTime fecha;
    private Double monto;

    public static PagoResponse fromEntity(ZarparDetalle detalle) {
        PagoResponse r = new PagoResponse();
        r.setIdPago(detalle.getIdZarparDetalle());
        r.setFecha(detalle.getZarpar().getFechaZarpar());
        r.setMonto(detalle.getSubtotal());
        return r;
    }
}
