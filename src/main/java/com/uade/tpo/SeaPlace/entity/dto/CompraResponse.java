package com.uade.tpo.SeaPlace.entity.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.uade.tpo.SeaPlace.entity.Compra;

import lombok.Data;

@Data
public class CompraResponse {
    private Long idCompra;
    private Long idUsuario;
    private LocalDateTime fechaCompra;
    private Double total;
    private String estado;
    private List<CompraDetalleResponse> detalles;

    public static CompraResponse fromEntity(Compra compra) {
        CompraResponse r = new CompraResponse();
        r.setIdCompra(compra.getIdCompra());
        if (compra.getUsuario() != null) {
            r.setIdUsuario(compra.getUsuario().getIdUsuario());
        }
        r.setFechaCompra(compra.getFechaCompra());
        r.setTotal(compra.getTotal());
        r.setEstado(compra.getEstado());
        r.setDetalles(compra.getDetalles() == null
                ? new ArrayList<>()
                : compra.getDetalles().stream().map(CompraDetalleResponse::fromEntity).toList());
        return r;
    }
}
