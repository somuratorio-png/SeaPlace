package com.uade.tpo.SeaPlace.entity.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.uade.tpo.SeaPlace.entity.Zarpar;

import lombok.Data;

@Data
public class ZarparResponse {
    private Long idZarpar;
    private Long idUsuario;
    private LocalDateTime fechaZarpar;
    private Double total;
    private String estado;
    private boolean conBotiquin;
    // Si la lista esta vacia, el campo directamente no se incluye en el JSON.
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
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
        r.setConBotiquin(zarpar.isConBotiquin());
        r.setDetalles(zarpar.getDetalles() == null
                ? new ArrayList<>()
                : zarpar.getDetalles().stream().map(ZarparDetalleResponse::fromEntity).toList());
        return r;
    }
}
