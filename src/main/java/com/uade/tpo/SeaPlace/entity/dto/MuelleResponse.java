package com.uade.tpo.SeaPlace.entity.dto;

import java.time.LocalDateTime;

import com.uade.tpo.SeaPlace.entity.Muelle;

import lombok.Data;

@Data
public class MuelleResponse {
    private Long idMuelle;
    private Long idUsuario;
    private LocalDateTime fechaCreacion;
    private String estado;

    public static MuelleResponse fromEntity(Muelle muelle) {
        MuelleResponse r = new MuelleResponse();
        r.setIdMuelle(muelle.getIdMuelle());
        if (muelle.getUsuario() != null) {
            r.setIdUsuario(muelle.getUsuario().getIdUsuario());
        }
        r.setFechaCreacion(muelle.getFechaCreacion());
        r.setEstado(muelle.getEstado());
        return r;
    }
}
