package com.uade.tpo.SeaPlace.controllers.auth;

import lombok.Data;

@Data
public class RestablecerContraseniaRequest {
    private String mail;
    private String codigo;
    private String contraseniaNueva;
}