package com.uade.tpo.SeaPlace.entity.dto;

import lombok.Data;

// Lo que ve un administrador al revisar los cambios que un refugio pidio sobre un animal ya publicado:
// el animal tal como esta publicado hoy y lo que el refugio propone (solo vienen los campos de la ficha).
@Data
public class CambioPendienteResponse {
    private AnimalResponse animal;
    private AnimalUpdateRequest cambio;
    // El nombre de la categoria propuesta, para mostrarla sin tener que buscarla (null si no la cambia)
    private String nombreCategoriaPropuesta;
}
