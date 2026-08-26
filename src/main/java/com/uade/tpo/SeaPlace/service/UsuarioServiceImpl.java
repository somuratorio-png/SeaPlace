package com.uade.tpo.SeaPlace.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.uade.tpo.SeaPlace.entity.Rol;
import com.uade.tpo.SeaPlace.entity.Usuario;
import com.uade.tpo.SeaPlace.entity.dto.UsuarioRequest;
import com.uade.tpo.SeaPlace.exceptions.RecursoDuplicadoException;
import com.uade.tpo.SeaPlace.exceptions.RecursoNoEncontradoException;
import com.uade.tpo.SeaPlace.repository.RolRepository;
import com.uade.tpo.SeaPlace.repository.UsuarioRepository;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Override
    public Page<Usuario> getUsuarios(PageRequest pageRequest) {
        return usuarioRepository.findAll(pageRequest);
    }

    @Override
    public Optional<Usuario> getUsuarioById(Long usuarioId) {
        return usuarioRepository.findById(usuarioId);
    }

    @Override
    public Usuario createUsuario(UsuarioRequest request) {
        Rol rol = rolRepository.findById(request.getIdRol())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el rol con id " + request.getIdRol()));

        // El mail y el nombre de usuario identifican a la persona en el sistema, por eso no
        // pueden repetirse entre cuentas.
        if (usuarioRepository.existsByMail(request.getMail())) {
            throw new RecursoDuplicadoException("Ya existe un usuario con el mail " + request.getMail());
        }
        if (usuarioRepository.existsByNombreUsuario(request.getNombreUsuario())) {
            throw new RecursoDuplicadoException(
                    "Ya existe un usuario con el nombre de usuario " + request.getNombreUsuario());
        }

        Usuario usuario = new Usuario();
        usuario.setRol(rol);
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setMail(request.getMail());
        usuario.setNombreUsuario(request.getNombreUsuario());
        usuario.setContrasenia(request.getContrasenia());
        usuario.setFechaRegistro(LocalDateTime.now());

        return usuarioRepository.save(usuario);
    }
}