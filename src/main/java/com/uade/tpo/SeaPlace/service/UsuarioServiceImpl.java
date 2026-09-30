package com.uade.tpo.SeaPlace.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;

import com.uade.tpo.SeaPlace.entity.Rol;
import com.uade.tpo.SeaPlace.entity.Usuario;
import com.uade.tpo.SeaPlace.entity.dto.UsuarioRequest;
import com.uade.tpo.SeaPlace.exceptions.RecursoDuplicadoException;
import com.uade.tpo.SeaPlace.exceptions.RecursoNoEncontradoException;
import com.uade.tpo.SeaPlace.repository.RolRepository;
import com.uade.tpo.SeaPlace.repository.UsuarioRepository;
import com.uade.tpo.SeaPlace.exceptions.ReglaDeNegocioException;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private static final String ROL_ADMINISTRADOR = "administrador";

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AutorizacionService autorizacionService;

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
        if (!autorizacionService.esAdmin()) {
            throw new AccessDeniedException("No tenes permiso para crear usuarios");
        }

        if (request.getIdRol() == null) {
            throw new ReglaDeNegocioException("El campo 'idRol' es obligatorio");
        }

        String nombre = ValidadorUsuarioService.textoObligatorio(request.getNombre(), "nombre");
        String apellido = ValidadorUsuarioService.textoObligatorio(request.getApellido(), "apellido");
        String mail = ValidadorUsuarioService.mailValido(request.getMail());
        String nombreUsuario = ValidadorUsuarioService.nombreUsuarioValido(request.getNombreUsuario());
        ValidadorUsuarioService.validarContrasenia(request.getContrasenia());

        Rol rol = rolRepository.findById(request.getIdRol())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el rol con id " + request.getIdRol()));

        if (usuarioRepository.existsByMail(mail)) {
            throw new RecursoDuplicadoException("Ya existe un usuario con el mail " + mail);
        }
        if (usuarioRepository.existsByNombreUsuario(nombreUsuario)) {
            throw new RecursoDuplicadoException(
                    "Ya existe un usuario con el nombre de usuario " + nombreUsuario);
        }

        Usuario usuario = new Usuario();
        usuario.setRol(rol);
        usuario.setNombre(nombre);
        usuario.setApellido(apellido);
        usuario.setMail(mail);
        usuario.setNombreUsuario(nombreUsuario);
        usuario.setContrasenia(passwordEncoder.encode(request.getContrasenia()));
        usuario.setFechaRegistro(LocalDateTime.now());

        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario cambiarRol(Long usuarioId, Long idRol) {
        if (idRol == null) {
            throw new ReglaDeNegocioException("El campo 'idRol' es obligatorio");
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el usuario con id " + usuarioId));

        Rol rol = rolRepository.findById(idRol)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el rol con id " + idRol));

        // Si el usuario es administrador y el rol nuevo no lo es, tiene que quedar
        // al menos otro administrador: si no, nadie podria volver a gestionar roles.
        boolean eraAdmin = usuario.getRol().getNombreRol().equalsIgnoreCase(ROL_ADMINISTRADOR);
        boolean seguiraSiendoAdmin = rol.getNombreRol().equalsIgnoreCase(ROL_ADMINISTRADOR);
        if (eraAdmin && !seguiraSiendoAdmin
                && usuarioRepository.countByRol_NombreRol(ROL_ADMINISTRADOR) <= 1) {
            throw new ReglaDeNegocioException("No se puede quitar el rol al ultimo administrador");
        }

        usuario.setRol(rol);
        return usuarioRepository.save(usuario);
    }
}