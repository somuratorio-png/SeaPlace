package com.uade.tpo.SeaPlace.entity.dto;

import lombok.Data;

// Lo que un patrocinador puede cambiar de su perfil. El nombre de la empresa queda fijo.
@Data
public class PatrocinadorPerfilRequest {
    private String descripcion;
    private String sitioWeb;
    private String icono;
    private String beneficio;
    private String cupon;
}
