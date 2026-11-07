package com.uade.tpo.SeaPlace.entity.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
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
    private String plan;
    // Si un patrocinador duplico este renglon: cuanto puso y quien. Si no, no se incluyen en el JSON.
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Double aportePatrocinador;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String nombrePatrocinador;

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
        r.setPlan(detalle.getPlan().name());
        if (detalle.getCampania() != null) {
            r.setAportePatrocinador(detalle.getAportePatrocinador());
            r.setNombrePatrocinador(detalle.getCampania().getPatrocinador().getNombreEmpresa());
        }
        return r;
    }
}
