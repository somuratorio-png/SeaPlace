package com.uade.tpo.SeaPlace.entity.dto;

import com.uade.tpo.SeaPlace.entity.Favorito;

import lombok.Data;

@Data
public class FavoritoResponse {
    private Long idAnimal;
    private String nombreAnimal;
    // El animal completo, para que el cliente pueda mostrar el favorito sin pedirlo aparte.
    private AnimalResponse animal;

    public static FavoritoResponse fromEntity(Favorito favorito) {
        FavoritoResponse r = new FavoritoResponse();
        r.setIdAnimal(favorito.getAnimal().getIdAnimal());
        r.setNombreAnimal(favorito.getAnimal().getNombreAnimal());
        r.setAnimal(AnimalResponse.fromEntity(favorito.getAnimal()));
        return r;
    }
}
