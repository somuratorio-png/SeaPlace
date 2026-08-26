package com.uade.tpo.SeaPlace.entity.dto;

import java.time.LocalDateTime;

import com.uade.tpo.SeaPlace.entity.Usuario;

import lombok.Data;

// Sin contrasenia a proposito: este DTO existe para que no viaje en las respuestas.
@Data
public class UsuarioResponse {
    private Long idUsuario;
    private String nombre;
    private String apellido;
    private String mail;
    private String nombreUsuario;
    private LocalDateTime fechaRegistro;
    private Long idRol;
    private String nombreRol;

    public static UsuarioResponse fromEntity(Usuario usuario) {
        UsuarioResponse r = new UsuarioResponse();
        r.setIdUsuario(usuario.getIdUsuario());
        r.setNombre(usuario.getNombre());
        r.setApellido(usuario.getApellido());
        r.setMail(usuario.getMail());
        r.setNombreUsuario(usuario.getNombreUsuario());
        r.setFechaRegistro(usuario.getFechaRegistro());
        if (usuario.getRol() != null) {
            r.setIdRol(usuario.getRol().getIdRol());
            r.setNombreRol(usuario.getRol().getNombreRol());
        }
        return r;
    }
}
