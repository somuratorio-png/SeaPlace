package com.uade.tpo.SeaPlace.controllers.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRefugioRequest {
    private String nombre;
    private String apellido;
    private String mail;
    private String nombreUsuario;
    private String contrasenia;
    private String nombreRefugio;
    private String descripcion;
}