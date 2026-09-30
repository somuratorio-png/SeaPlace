package com.uade.tpo.SeaPlace.service;

import java.util.List;
import java.util.Optional;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.SeaPlace.entity.Permiso;
import com.uade.tpo.SeaPlace.entity.Rol;
import com.uade.tpo.SeaPlace.entity.dto.AsignarPermisosRequest;
import com.uade.tpo.SeaPlace.entity.dto.RolRequest;
import com.uade.tpo.SeaPlace.exceptions.RecursoNoEncontradoException;
import com.uade.tpo.SeaPlace.exceptions.RecursoDuplicadoException;
import com.uade.tpo.SeaPlace.exceptions.ReglaDeNegocioException;
import com.uade.tpo.SeaPlace.repository.PermisoRepository;
import com.uade.tpo.SeaPlace.repository.RolRepository;

@Service
public class RolServiceImpl implements RolService {

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PermisoRepository permisoRepository;

    private static final int LARGO_MAXIMO = 255;
    private static final String ROL_ADMINISTRADOR = "administrador";
    private static final String PERMISO_GESTIONAR_ROLES = "GESTIONAR_ROLES";

    @Override
    public List<Rol> getRoles() {
        return rolRepository.findAll();
    }

    @Override
    public Optional<Rol> getRolById(Long rolId) {
        return rolRepository.findById(rolId);
    }

    @Override
    public Rol createRol(RolRequest request) {
        String nombreRol = request.getNombreRol() == null ? "" : request.getNombreRol().trim();
        if (nombreRol.isEmpty()) {
            throw new ReglaDeNegocioException("El nombre del rol es obligatorio");
        }
        if (nombreRol.length() > LARGO_MAXIMO) {
            throw new ReglaDeNegocioException(
                    "El nombre del rol no puede superar los " + LARGO_MAXIMO + " caracteres");
        }

        // El nombre identifica al rol en toda la app, por eso no puede repetirse.
        if (rolRepository.findByNombreRol(nombreRol).isPresent()) {
            throw new RecursoDuplicadoException("Ya existe un rol con el nombre " + nombreRol);
        }

        Rol rol = new Rol();
        rol.setNombreRol(nombreRol);

        return rolRepository.save(rol);
    }

    @Override
    public Rol asignarPermisos(Long rolId, AsignarPermisosRequest request) {
        Rol rol = rolRepository.findById(rolId)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el rol con id " + rolId));

        List<Long> idPermisos = request.getIdPermisos();

        if (idPermisos == null || idPermisos.isEmpty()) {
            throw new ReglaDeNegocioException("Debe indicar al menos un permiso para asignar");
        }
        if (idPermisos.stream().anyMatch(Objects::isNull)) {
            throw new ReglaDeNegocioException("La lista de permisos no puede tener ids vacios");
        }

        // Sin repetidos: si llega el mismo id dos veces, findAllById lo devuelve una sola vez
        // y la comparacion de abajo daria un falso "no existe".
        List<Long> idsUnicos = idPermisos.stream().distinct().toList();

        List<Permiso> permisos = permisoRepository.findAllById(idsUnicos);

        // Si algun id no corresponde a un permiso existente, no se asigna nada: asignar un
        // conjunto parcial dejaria al rol con permisos distintos a los pedidos.
        if (permisos.size() != idsUnicos.size()) {
            throw new RecursoNoEncontradoException("Uno o mas ids de permiso no existen");
        }

        // El rol administrador no puede perder GESTIONAR_ROLES: sin ese permiso nadie
        // podria volver a asignar permisos ni crear roles.
        if (rol.getNombreRol().equalsIgnoreCase(ROL_ADMINISTRADOR)
                && permisos.stream().noneMatch(
                        p -> PERMISO_GESTIONAR_ROLES.equalsIgnoreCase(p.getNombrePermiso()))) {
            throw new ReglaDeNegocioException(
                    "El rol administrador debe conservar el permiso " + PERMISO_GESTIONAR_ROLES);
        }

        // La asignacion reemplaza el conjunto completo de permisos del rol.
        rol.setPermisos(permisos);

        return rolRepository.save(rol);
    }

}