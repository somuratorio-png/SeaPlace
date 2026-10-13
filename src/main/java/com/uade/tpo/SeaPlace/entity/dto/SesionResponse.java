package com.uade.tpo.SeaPlace.entity.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

// Todo lo que el front necesita de quien esta logueado, en una sola respuesta. Viaja en /inicio
// (si el pedido trae token) y en la respuesta del login y del registro.
// Lo que esta vacio o no le corresponde a ese usuario directamente no se incluye en el JSON.
@Data
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class SesionResponse {
    private UsuarioResponse usuario;
    private List<FavoritoResponse> favoritos;
    // El muelle activo y sus items: solo para quien puede apadrinar.
    private Long idMuelle;
    private List<MuelleDetalleResponse> itemsMuelle;
    // Los que le corresponden: un padrino los suyos, un refugio los de sus animales y un admin todos.
    private List<ApadrinamientoResponse> apadrinamientos;
    // Publicaciones pausadas: un refugio ve las suyas y un admin todas.
    private List<AnimalResponse> pausados;
    // Solo para quien tiene el permiso de gestionarlos.
    private List<UsuarioResponse> usuarios;
    private List<RolResponse> roles;
    private List<PermisoResponse> permisos;
}
