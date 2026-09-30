package com.uade.tpo.SeaPlace.entity.dto;

import com.uade.tpo.SeaPlace.entity.MuelleDetalle;

import lombok.Data;

@Data
public class MuelleDetalleResponse {
    private Long idMuelleDetalle;
    private Long idMuelle;
    private Long idAnimal;
    private String nombreAnimal;
    private Integer cantidad;
    private Double precioUnitario;

    public static MuelleDetalleResponse fromEntity(MuelleDetalle detalle) {
        MuelleDetalleResponse r = new MuelleDetalleResponse();
        r.setIdMuelleDetalle(detalle.getIdMuelleDetalle());
        if (detalle.getMuelle() != null) {
            r.setIdMuelle(detalle.getMuelle().getIdMuelle());
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
