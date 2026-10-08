package com.uade.tpo.SeaPlace.entity.dto;

import com.uade.tpo.SeaPlace.entity.Plan;

import lombok.Data;

@Data
public class PlanResponse {
    // El codigo es lo que se manda en los pedidos (ej: "MAREA_PROFUNDA"); el nombre es el que se muestra.
    private String codigo;
    private String nombre;
    private double multiplicador;
    private String descripcion;
    private boolean ubicacionEnVivo;

    public static PlanResponse fromPlan(Plan plan) {
        PlanResponse r = new PlanResponse();
        r.setCodigo(plan.name());
        r.setNombre(plan.getNombre());
        r.setMultiplicador(plan.getMultiplicador());
        r.setDescripcion(plan.getDescripcion());
        r.setUbicacionEnVivo(plan.isUbicacionEnVivo());
        return r;
    }
}
