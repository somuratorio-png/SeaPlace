package com.uade.tpo.SeaPlace.entity.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
public class InicioResponse {
    private List<PlanResponse> planes;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private SesionResponse sesion;
}
