package com.uade.tpo.SeaPlace.service;

import java.util.List;
import java.util.Optional;

import com.uade.tpo.SeaPlace.entity.Rol;
import com.uade.tpo.SeaPlace.entity.dto.AsignarPermisosRequest;
import com.uade.tpo.SeaPlace.entity.dto.RolRequest;

public interface RolService {
    List<Rol> getRoles();

    Optional<Rol> getRolById(Long rolId);

    Rol createRol(RolRequest request);

    Rol asignarPermisos(Long rolId, AsignarPermisosRequest request);
}