package com.uade.tpo.SeaPlace.entity.dto;

import com.uade.tpo.SeaPlace.entity.Patrocinador;

import lombok.Data;

// Un beneficio de un patrocinador para quienes apadrinan, con su codigo para usarlo
@Data
public class BeneficioResponse {
    private Long idPatrocinador;
    private String nombreEmpresa;
    private String icono;
    private String sitioWeb;
    private String beneficio;
    private String cupon;

    public static BeneficioResponse fromEntity(Patrocinador patrocinador) {
        BeneficioResponse r = new BeneficioResponse();
        r.setIdPatrocinador(patrocinador.getIdPatrocinador());
        r.setNombreEmpresa(patrocinador.getNombreEmpresa());
        r.setIcono(patrocinador.getIcono());
        r.setSitioWeb(patrocinador.getSitioWeb());
        r.setBeneficio(patrocinador.getBeneficio());
        r.setCupon(patrocinador.getCupon());
        return r;
    }
}
