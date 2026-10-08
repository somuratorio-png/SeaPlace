package com.uade.tpo.SeaPlace.entity.dto;

import com.uade.tpo.SeaPlace.entity.Favorito;

import lombok.Data;

@Data
public class FavoritoResponse {
    private Long idAnimal;
    private String nombreAnimal;

    public static FavoritoResponse fromEntity(Favorito favorito) {
        FavoritoResponse r = new FavoritoResponse();
        r.setIdAnimal(favorito.getAnimal().getIdAnimal());
        r.setNombreAnimal(favorito.getAnimal().getNombreAnimal());
        return r;
    }
}
