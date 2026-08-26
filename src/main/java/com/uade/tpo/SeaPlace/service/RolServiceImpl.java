package com.uade.tpo.SeaPlace.service;

import java.util.List;
import java.util.Optional;

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
        // El nombre identifica al rol en toda la app, por eso no puede repetirse.
        if (rolRepository.findByNombreRol(request.getNombreRol()).isPresent()) {
            throw new RecursoDuplicadoException("Ya existe un rol con el nombre " + request.getNombreRol());
        }

        Rol rol = new Rol();
        rol.setNombreRol(request.getNombreRol());

        return rolRepository.save(rol);
    }

    @Override
    public Rol asignarPermisos(Long rolId, AsignarPermisosRequest request) {
        Rol rol = rolRepository.findById(rolId)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el rol con id " + rolId));

        if (request.getIdPermisos() == null || request.getIdPermisos().isEmpty()) {
            throw new ReglaDeNegocioException("Debe indicar al menos un permiso para asignar");
        }

        List<Permiso> permisos = permisoRepository.findAllById(request.getIdPermisos());

        // Si algun id no corresponde a un permiso existente, no se asigna nada: asignar un
        // conjunto parcial dejaria al rol con permisos distintos a los pedidos.
        if (permisos.size() != request.getIdPermisos().size()) {
            throw new RecursoNoEncontradoException("Uno o mas ids de permiso no existen");
        }

        // La asignacion reemplaza el conjunto completo de permisos del rol.
        rol.setPermisos(permisos);

        return rolRepository.save(rol);
    }
}
