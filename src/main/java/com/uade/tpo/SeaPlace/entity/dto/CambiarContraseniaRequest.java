package com.uade.tpo.SeaPlace.entity.dto;

import lombok.Data;

@Data
public class CambiarContraseniaRequest {
    private String contraseniaActual;
    private String contraseniaNueva;
}