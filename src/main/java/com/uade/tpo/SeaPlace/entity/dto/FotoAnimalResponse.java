package com.uade.tpo.SeaPlace.entity.dto;

import com.uade.tpo.SeaPlace.entity.FotoAnimal;

import lombok.Data;

@Data
public class FotoAnimalResponse {
    private Long idFoto;
    private Long idAnimal;
    private String urlImagen;
    private Integer orden;

    public static FotoAnimalResponse fromEntity(FotoAnimal foto) {
        FotoAnimalResponse r = new FotoAnimalResponse();
        r.setIdFoto(foto.getIdFoto());
        if (foto.getAnimal() != null) {
            r.setIdAnimal(foto.getAnimal().getIdAnimal());
        }
        r.setUrlImagen(foto.getUrlImagen());
        r.setOrden(foto.getOrden());
        return r;
    }
}
