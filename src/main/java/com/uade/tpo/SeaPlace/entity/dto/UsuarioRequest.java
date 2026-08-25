package com.uade.tpo.SeaPlace.entity.dto;

import lombok.Data;

@Data
public class UsuarioRequest {
    private Long idRol;
    private String nombre;
    private String apellido;
    private String mail;
    private String nombreUsuario;
    private String contrasenia;
}
