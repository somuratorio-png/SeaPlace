package com.uade.tpo.SeaPlace.entity.dto;

import java.util.ArrayList;
import java.util.List;

import com.uade.tpo.SeaPlace.entity.Permiso;
import com.uade.tpo.SeaPlace.entity.Rol;

import lombok.Data;

@Data
public class RolResponse {
    private Long idRol;
    private String nombreRol;
    private List<String> permisos;

    public static RolResponse fromEntity(Rol rol) {
        RolResponse r = new RolResponse();
        r.setIdRol(rol.getIdRol());
        r.setNombreRol(rol.getNombreRol());
        r.setPermisos(rol.getPermisos() == null
                ? new ArrayList<>()
                : rol.getPermisos().stream().map(Permiso::getNombrePermiso).toList());
        return r;
    }
}
