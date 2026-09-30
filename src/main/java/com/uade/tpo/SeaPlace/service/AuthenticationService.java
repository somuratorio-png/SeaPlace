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
import com.uade.tpo.SeaPlace.exceptions.ReglaDeNegocioException;
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
        String nombre = ValidadorUsuarioService.textoObligatorio(request.getNombre(), "nombre");
        String apellido = ValidadorUsuarioService.textoObligatorio(request.getApellido(), "apellido");
        String mail = ValidadorUsuarioService.mailValido(request.getMail());
        String nombreUsuario = ValidadorUsuarioService.nombreUsuarioValido(request.getNombreUsuario());
        ValidadorUsuarioService.validarContrasenia(request.getContrasenia());

        if (usuarioRepository.existsByMail(mail)) {
            throw new RecursoDuplicadoException("Ya existe un usuario con el mail " + mail);
        }
        if (usuarioRepository.existsByNombreUsuario(nombreUsuario)) {
            throw new RecursoDuplicadoException(
                    "Ya existe un usuario con el nombre de usuario " + nombreUsuario);
        }

        Rol rolComprador = rolRepository.findByNombreRol(ROL_POR_DEFECTO)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el rol por defecto '" + ROL_POR_DEFECTO + "'"));

        Usuario usuario = new Usuario();
        usuario.setNombre(nombre);
        usuario.setApellido(apellido);
        usuario.setMail(mail);
        usuario.setNombreUsuario(nombreUsuario);
        usuario.setContrasenia(passwordEncoder.encode(request.getContrasenia()));
        usuario.setFechaRegistro(LocalDateTime.now());
        usuario.setRol(rolComprador);

        usuarioRepository.save(usuario);

        var jwtToken = jwtService.generateToken(usuario);
        return AuthenticationResponse.builder().accessToken(jwtToken).build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        String nombreUsuario = request.getNombreUsuario() == null ? "" : request.getNombreUsuario().trim();
        if (nombreUsuario.isEmpty() || request.getContrasenia() == null || request.getContrasenia().isEmpty()) {
            throw new ReglaDeNegocioException("Debe indicar nombreUsuario y contrasenia");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        nombreUsuario,
                        request.getContrasenia()));

        Usuario usuario = usuarioRepository.findByNombreUsuario(nombreUsuario)
                .orElseThrow();

        var jwtToken = jwtService.generateToken(usuario);
        return AuthenticationResponse.builder().accessToken(jwtToken).build();
    }
}