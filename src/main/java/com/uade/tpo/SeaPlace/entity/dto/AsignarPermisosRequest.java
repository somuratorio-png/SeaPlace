// Para asociar permisos a un rol (reemplaza a la entidad RolPermiso explícita)
package com.uade.tpo.SeaPlace.entity.dto;

import java.util.List;

import lombok.Data;

@Data
public class AsignarPermisosRequest {
    private List<Long> idPermisos;
}