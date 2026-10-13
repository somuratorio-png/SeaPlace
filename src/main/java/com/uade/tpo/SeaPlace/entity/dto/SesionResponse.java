package com.uade.tpo.SeaPlace.entity.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

// Lo que el front necesita de quien esta logueado en cualquier pantalla: quien es, sus
// favoritos y su muelle. Viaja en /inicio (si el pedido trae token) y en la respuesta del
// login y del registro. Lo demas (apadrinamientos, usuarios, etc.) lo pide cada pantalla.
// Lo que esta vacio o no le corresponde a ese usuario directamente no se incluye en el JSON.
@Data
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class SesionResponse {
    private UsuarioResponse usuario;
    private List<FavoritoResponse> favoritos;
    // El muelle activo y sus items: solo para quien puede apadrinar.
    private Long idMuelle;
    private List<MuelleDetalleResponse> itemsMuelle;
}
