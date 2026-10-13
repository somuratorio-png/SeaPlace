package com.uade.tpo.SeaPlace.entity.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

// Lo que el front necesita al abrir la pagina, sea cual sea la pantalla: los planes y,
// si el pedido trae token, la sesion de ese usuario.
@Data
public class InicioResponse {
    private List<PlanResponse> planes;
    // Los datos de quien esta logueado. Sin token (o con uno vencido) no se incluye.
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private SesionResponse sesion;
}
