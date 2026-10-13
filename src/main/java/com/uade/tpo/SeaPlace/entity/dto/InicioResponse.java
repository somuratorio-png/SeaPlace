package com.uade.tpo.SeaPlace.entity.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

// Todo lo que el front necesita al abrir la pagina, en una sola respuesta.
@Data
public class InicioResponse {
    // Si una lista esta vacia, el campo directamente no se incluye en el JSON.
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private List<AnimalResponse> animales;
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private List<CategoriaResponse> categorias;
    private List<PlanResponse> planes;
    // Los datos de quien esta logueado. Sin token (o con uno vencido) no se incluye.
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private SesionResponse sesion;
}
