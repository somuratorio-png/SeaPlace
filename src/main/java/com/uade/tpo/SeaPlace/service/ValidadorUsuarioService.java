package com.uade.tpo.SeaPlace.service;

import java.nio.charset.StandardCharsets;
import java.util.regex.Pattern;

import com.uade.tpo.SeaPlace.exceptions.ReglaDeNegocioException;

// Validaciones de datos de usuario compartidas por el registro publico
// (AuthenticationService) y el alta hecha por un admin (UsuarioServiceImpl).
public final class ValidadorUsuarioService {

    private static final int LARGO_MAXIMO = 255;
    private static final int CONTRASENIA_MINIMA = 6;
    // BCrypt solo admite hasta 72 bytes: mas que eso, el encoder tira excepcion.
    private static final int CONTRASENIA_MAXIMA_BYTES = 72;
    private static final Pattern FORMATO_MAIL = Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");

    private ValidadorUsuarioService() {
    }

    // Devuelve el texto sin espacios de los costados; corta si esta vacio o no entra en la columna.
    public static String textoObligatorio(String valor, String campo) {
        String limpio = valor == null ? "" : valor.trim();
        if (limpio.isEmpty()) {
            throw new ReglaDeNegocioException("El campo '" + campo + "' es obligatorio");
        }
        if (limpio.length() > LARGO_MAXIMO) {
            throw new ReglaDeNegocioException(
                    "El campo '" + campo + "' no puede superar los " + LARGO_MAXIMO + " caracteres");
        }
        return limpio;
    }

    public static String mailValido(String valor) {
        String mail = textoObligatorio(valor, "mail");
        if (!FORMATO_MAIL.matcher(mail).matches()) {
            throw new ReglaDeNegocioException("El mail no tiene un formato valido");
        }
        return mail;
    }

    public static String nombreUsuarioValido(String valor) {
        String nombreUsuario = textoObligatorio(valor, "nombreUsuario");
        if (nombreUsuario.chars().anyMatch(Character::isWhitespace)) {
            throw new ReglaDeNegocioException("El nombre de usuario no puede tener espacios");
        }
        return nombreUsuario;
    }

    // La contrasenia no se recorta: los espacios pueden ser parte de la clave.
    public static void validarContrasenia(String contrasenia) {
        if (contrasenia == null || contrasenia.isBlank()) {
            throw new ReglaDeNegocioException("El campo 'contrasenia' es obligatorio");
        }
        if (contrasenia.length() < CONTRASENIA_MINIMA) {
            throw new ReglaDeNegocioException(
                    "La contrasenia debe tener al menos " + CONTRASENIA_MINIMA + " caracteres");
        }
        if (contrasenia.getBytes(StandardCharsets.UTF_8).length > CONTRASENIA_MAXIMA_BYTES) {
            throw new ReglaDeNegocioException("La contrasenia es demasiado larga");
        }
    }
}