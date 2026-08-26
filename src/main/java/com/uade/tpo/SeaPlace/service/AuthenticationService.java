package com.uade.tpo.SeaPlace.service;

import java.time.LocalDateTime;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.uade.tpo.SeaPlace.controllers.auth.AuthenticationRequest;
import com.uade.tpo.SeaPlace.controllers.auth.AuthenticationResponse;
import com.uade.tpo.SeaPlace.controllers.auth.RegisterRequest;
import com.uade.tpo.SeaPlace.controllers.config.JwtService;
import com.uade.tpo.SeaPlace.entity.Rol;
import com.uade.tpo.SeaPlace.entity.Usuario;
import com.uade.tpo.SeaPlace.exceptions.RecursoDuplicadoException;
import com.uade.tpo.SeaPlace.exceptions.RecursoNoEncontradoException;
import com.uade.tpo.SeaPlace.repository.RolRepository;
import com.uade.tpo.SeaPlace.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private static final String ROL_POR_DEFECTO = "comprador";

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByMail(request.getMail())) {
            throw new RecursoDuplicadoException("Ya existe un usuario con el mail " + request.getMail());
        }
        if (usuarioRepository.existsByNombreUsuario(request.getNombreUsuario())) {
            throw new RecursoDuplicadoException(
                    "Ya existe un usuario con el nombre de usuario " + request.getNombreUsuario());
        }

        Rol rolComprador = rolRepository.findByNombreRol(ROL_POR_DEFECTO)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el rol por defecto '" + ROL_POR_DEFECTO + "'"));

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setMail(request.getMail());
        usuario.setNombreUsuario(request.getNombreUsuario());
        usuario.setContrasenia(passwordEncoder.encode(request.getContrasenia()));
        usuario.setFechaRegistro(LocalDateTime.now());
        usuario.setRol(rolComprador);

        usuarioRepository.save(usuario);

        var jwtToken = jwtService.generateToken(usuario);
        return AuthenticationResponse.builder().accessToken(jwtToken).build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getNombreUsuario(),
                        request.getContrasenia()));

        Usuario usuario = usuarioRepository.findByNombreUsuario(request.getNombreUsuario())
                .orElseThrow();

        var jwtToken = jwtService.generateToken(usuario);
        return AuthenticationResponse.builder().accessToken(jwtToken).build();
    }
}