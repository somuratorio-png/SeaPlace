package com.uade.tpo.SeaPlace.entity.dto;

import com.uade.tpo.SeaPlace.entity.Refugio;

import lombok.Data;

@Data
public class RefugioResponse {
    private Long idRefugio;
    private String nombreRefugio;
    private String descripcion;
    private Long idUsuario;
    private boolean aprobado;

    public static RefugioResponse fromEntity(Refugio refugio) {
        RefugioResponse r = new RefugioResponse();
        r.setIdRefugio(refugio.getIdRefugio());
        r.setNombreRefugio(refugio.getNombreRefugio());
        r.setDescripcion(refugio.getDescripcion());
        r.setAprobado(refugio.isAprobado());
        if (refugio.getUsuario() != null) {
            r.setIdUsuario(refugio.getUsuario().getIdUsuario());
        }
        return r;
    }
}
