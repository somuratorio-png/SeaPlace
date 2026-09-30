package com.uade.tpo.SeaPlace.entity.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.uade.tpo.SeaPlace.entity.Zarpar;

import lombok.Data;

@Data
public class ZarparResponse {
    private Long idZarpar;
    private Long idUsuario;
    private LocalDateTime fechaZarpar;
    private Double total;
    private String estado;
    private List<ZarparDetalleResponse> detalles;

    public static ZarparResponse fromEntity(Zarpar zarpar) {
        ZarparResponse r = new ZarparResponse();
        r.setIdZarpar(zarpar.getIdZarpar());
        if (zarpar.getUsuario() != null) {
            r.setIdUsuario(zarpar.getUsuario().getIdUsuario());
        }
        r.setFechaZarpar(zarpar.getFechaZarpar());
        r.setTotal(zarpar.getTotal());
        r.setEstado(zarpar.getEstado());
        r.setDetalles(zarpar.getDetalles() == null
                ? new ArrayList<>()
                : zarpar.getDetalles().stream().map(ZarparDetalleResponse::fromEntity).toList());
        return r;
    }
}
