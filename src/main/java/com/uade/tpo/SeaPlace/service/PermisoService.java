package com.uade.tpo.SeaPlace.service;

import java.util.List;
import java.util.Optional;

import com.uade.tpo.SeaPlace.entity.Permiso;
import com.uade.tpo.SeaPlace.entity.dto.PermisoRequest;

public interface PermisoService {
    List<Permiso> getPermisos();

    Optional<Permiso> getPermisoById(Long permisoId);

    Permiso createPermiso(PermisoRequest request);
}