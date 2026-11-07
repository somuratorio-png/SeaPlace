package com.uade.tpo.SeaPlace.controllers.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// El alta de una empresa patrocinadora: la persona de contacto (nombre y apellido) y el nombre de la empresa
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterPatrocinadorRequest {
    private String nombre;
    private String apellido;
    private String mail;
    private String nombreUsuario;
    private String contrasenia;
    private String nombreEmpresa;
}
