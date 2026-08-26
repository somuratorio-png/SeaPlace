package com.uade.tpo.SeaPlace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.SeaPlace.entity.Permiso;
import com.uade.tpo.SeaPlace.entity.dto.PermisoRequest;
import com.uade.tpo.SeaPlace.exceptions.RecursoDuplicadoException;
import com.uade.tpo.SeaPlace.repository.PermisoRepository;

@Service
public class PermisoServiceImpl implements PermisoService {

    @Autowired
    private PermisoRepository permisoRepository;

    @Override
    public List<Permiso> getPermisos() {
        return permisoRepository.findAll();
    }

    @Override
    public Optional<Permiso> getPermisoById(Long permisoId) {
        return permisoRepository.findById(permisoId);
    }

    @Override
    public Permiso createPermiso(PermisoRequest request) {
        // El nombre identifica al permiso al momento de autorizar, por eso no puede repetirse.
        if (permisoRepository.findByNombrePermiso(request.getNombrePermiso()).isPresent()) {
            throw new RecursoDuplicadoException(
                    "Ya existe un permiso con el nombre " + request.getNombrePermiso());
        }

        Permiso permiso = new Permiso();
        permiso.setNombrePermiso(request.getNombrePermiso());
        permiso.setDescripcion(request.getDescripcion());

        return permisoRepository.save(permiso);
    }
}
