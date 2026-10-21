package com.uade.tpo.SeaPlace.entity.dto;

import java.time.LocalDateTime;

import com.uade.tpo.SeaPlace.entity.ZarparDetalle;

import lombok.Data;

@Data
public class PagoResponse {
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
