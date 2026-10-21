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
    private String plan;
    private AnimalResponse animal;

    public static MuelleDetalleResponse fromEntity(MuelleDetalle detalle) {
        MuelleDetalleResponse r = new MuelleDetalleResponse();
        r.setIdMuelleDetalle(detalle.getIdMuelleDetalle());
        if (detalle.getMuelle() != null) {
            r.setIdMuelle(detalle.getMuelle().getIdMuelle());
        }
        if (detalle.getAnimal() != null) {
            r.setIdAnimal(detalle.getAnimal().getIdAnimal());
            r.setNombreAnimal(detalle.getAnimal().getNombreAnimal());
            r.setAnimal(AnimalResponse.fromEntity(detalle.getAnimal()));
        }
        r.setPlan(detalle.getPlan().name());
        r.setCantidad(detalle.getCantidad());
        r.setPrecioUnitario(detalle.getPrecioUnitario());
        return r;
    }
}
