package com.uade.tpo.SeaPlace.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.uade.tpo.SeaPlace.entity.Usuario;
import com.uade.tpo.SeaPlace.exceptions.ReglaDeNegocioException;
import com.uade.tpo.SeaPlace.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecuperacionContraseniaService {

    private static final int MINUTOS_DE_VIDA = 5;

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    // Genera un codigo de un solo uso y lo "envia". Como el proyecto no manda mails reales,
    // el mail se imprime en la consola del servidor. Si el mail no existe no se avisa:
    // asi nadie puede averiguar que mails estan registrados.
    public void solicitarCodigo(String mailCrudo) {
        String mail = ValidadorUsuarioService.mailValido(mailCrudo);

        usuarioRepository.findByMail(mail).filter(Usuario::isActivo).ifPresent(usuario -> {
            String codigo = UUID.randomUUID().toString().replace("-", "");
            usuario.setCodigoRecuperacion(passwordEncoder.encode(codigo));
            usuario.setCodigoRecuperacionVence(LocalDateTime.now().plusMinutes(MINUTOS_DE_VIDA));
            usuarioRepository.save(usuario);

            log.info("[MAIL SIMULADO] Para: {} | Codigo para restablecer tu contrasenia: {} (vence en {} minutos)",
                    mail, codigo, MINUTOS_DE_VIDA);
        });
    }

    public void restablecer(String mailCrudo, String codigo, String contraseniaNueva) {
        String mail = ValidadorUsuarioService.mailValido(mailCrudo);
        ValidadorUsuarioService.validarContrasenia(contraseniaNueva);

        // Un unico mensaje para cualquier fallo: asi no se sabe si fallo el mail o el codigo.
        Usuario usuario = usuarioRepository.findByMail(mail)
                .filter(Usuario::isActivo)
                .filter(u -> codigoValido(u, codigo))
                .orElseThrow(() -> new ReglaDeNegocioException("El codigo es incorrecto o ya vencio"));

        usuario.setContrasenia(passwordEncoder.encode(contraseniaNueva));
        // El codigo es de un solo uso.
        usuario.setCodigoRecuperacion(null);
        usuario.setCodigoRecuperacionVence(null);
        usuarioRepository.save(usuario);
    }

    private boolean codigoValido(Usuario usuario, String codigo) {
        return codigo != null
                && usuario.getCodigoRecuperacion() != null
                && usuario.getCodigoRecuperacionVence() != null
                && usuario.getCodigoRecuperacionVence().isAfter(LocalDateTime.now())
                && passwordEncoder.matches(codigo, usuario.getCodigoRecuperacion());
    }
}