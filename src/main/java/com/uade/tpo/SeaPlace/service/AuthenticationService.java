package com.uade.tpo.SeaPlace.service;

import java.time.LocalDateTime;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
import com.uade.tpo.SeaPlace.controllers.auth.RegisterRefugioRequest;
import com.uade.tpo.SeaPlace.entity.dto.RefugioRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private static final String ROL_POR_DEFECTO = "padrino";
    private static final String ROL_REFUGIO = "duenioRefugio";

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CuentaBajaService cuentaBajaService;
    private final RefugioService refugioService;

    public AuthenticationResponse register(RegisterRequest request) {
        Usuario usuario = crearUsuario(request.getNombre(), request.getApellido(), request.getMail(),
                request.getNombreUsuario(), request.getContrasenia(), ROL_POR_DEFECTO);

        var jwtToken = jwtService.generateToken(usuario);
        return AuthenticationResponse.builder().accessToken(jwtToken).build();
    }

    // Crea el usuario con rol refugio y su refugio en un solo paso. Es transaccional:
    // si el refugio es invalido (por ejemplo, nombre repetido), el usuario tampoco se guarda.
    @Transactional
    public AuthenticationResponse registerRefugio(RegisterRefugioRequest request) {
        Usuario usuario = crearUsuario(request.getNombre(), request.getApellido(), request.getMail(),
                request.getNombreUsuario(), request.getContrasenia(), ROL_REFUGIO);

        RefugioRequest refugioRequest = new RefugioRequest();
        refugioRequest.setIdUsuario(usuario.getIdUsuario());
        refugioRequest.setNombreRefugio(request.getNombreRefugio());
        refugioRequest.setDescripcion(request.getDescripcion());
        // Queda pendiente: un administrador lo tiene que aprobar antes de que pueda publicar.
        refugioService.createRefugioPendiente(refugioRequest);

        var jwtToken = jwtService.generateToken(usuario);
        return AuthenticationResponse.builder().accessToken(jwtToken).build();
    }

    // Valida los datos, controla duplicados y guarda un usuario nuevo con el rol indicado.
    private Usuario crearUsuario(String nombreCrudo, String apellidoCrudo, String mailCrudo,
                                String nombreUsuarioCrudo, String contrasenia, String nombreRol) {
        String nombre = ValidadorUsuarioService.textoObligatorio(nombreCrudo, "nombre");
        String apellido = ValidadorUsuarioService.textoObligatorio(apellidoCrudo, "apellido");
        String mail = ValidadorUsuarioService.mailValido(mailCrudo);
        String nombreUsuario = ValidadorUsuarioService.nombreUsuarioValido(nombreUsuarioCrudo);
        ValidadorUsuarioService.validarContrasenia(contrasenia);

        cuentaBajaService.liberarSiVencida(mail, nombreUsuario);

        if (usuarioRepository.existsByMail(mail)) {
            throw new RecursoDuplicadoException("Ya existe un usuario con el mail " + mail);
        }
        if (usuarioRepository.existsByNombreUsuario(nombreUsuario)) {
            throw new RecursoDuplicadoException(
                    "Ya existe un usuario con el nombre de usuario " + nombreUsuario);
        }

        Rol rol = rolRepository.findByNombreRol(nombreRol)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el rol '" + nombreRol + "'"));

        Usuario usuario = new Usuario();
        usuario.setNombre(nombre);
        usuario.setApellido(apellido);
        usuario.setMail(mail);
        usuario.setNombreUsuario(nombreUsuario);
        usuario.setContrasenia(passwordEncoder.encode(contrasenia));
        usuario.setFechaRegistro(LocalDateTime.now());
        usuario.setRol(rol);

        return usuarioRepository.save(usuario);
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        String nombreUsuario = request.getNombreUsuario() == null ? "" : request.getNombreUsuario().trim();
        if (nombreUsuario.isEmpty() || request.getContrasenia() == null || request.getContrasenia().isEmpty()) {
            throw new ReglaDeNegocioException("Debe indicar nombreUsuario y contrasenia");
        }

        reactivarSiCorresponde(nombreUsuario, request.getContrasenia());

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        nombreUsuario,
                        request.getContrasenia()));

        Usuario usuario = usuarioRepository.findByNombreUsuario(nombreUsuario)
                .orElseThrow();

        var jwtToken = jwtService.generateToken(usuario);
        return AuthenticationResponse.builder().accessToken(jwtToken).build();
    }

    // Si la cuenta esta de baja pero dentro del plazo, entrar con la contrasenia
    // correcta la reactiva. Con contrasenia incorrecta no cambia nada.
    private void reactivarSiCorresponde(String nombreUsuario, String contrasenia) {
        usuarioRepository.findByNombreUsuario(nombreUsuario).ifPresent(usuario -> {
            if (!usuario.isActivo() && !usuario.bajaVencida()
                    && passwordEncoder.matches(contrasenia, usuario.getContrasenia())) {
                usuario.setActivo(true);
                usuario.setFechaBaja(null);
                usuarioRepository.save(usuario);
            }
        });
    }
}