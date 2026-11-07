package com.uade.tpo.SeaPlace.entity.dto;

import java.util.List;

import lombok.Data;

// Todo lo que necesita el panel del patrocinador, en una sola respuesta:
// sus datos (con el cupon), sus campañas y el impacto que lograron.
@Data
public class MiPatrocinioResponse {
    private PatrocinadorResponse patrocinador;
    private String cupon;
    private List<CampaniaResponse> campanias;

    // El impacto, en dolares y en personas
    // plataMovilizada = lo que pusieron los padrinos en los pagos duplicados + lo que puso el patrocinador
    private double plataMovilizada;
    private int padrinosAlcanzados;
    private int aportesDuplicados;
}
