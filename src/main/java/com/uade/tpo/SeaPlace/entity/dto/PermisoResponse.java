package com.uade.tpo.SeaPlace.entity.dto;

import com.uade.tpo.SeaPlace.entity.Permiso;

import lombok.Data;

@Data
public class PermisoResponse {
    private Long idPermiso;
    private String nombrePermiso;
    private String descripcion;

    public static PermisoResponse fromEntity(Permiso permiso) {
        PermisoResponse r = new PermisoResponse();
        r.setIdPermiso(permiso.getIdPermiso());
        r.setNombrePermiso(permiso.getNombrePermiso());
        r.setDescripcion(permiso.getDescripcion());
        return r;
    }
}
