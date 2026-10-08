package com.uade.tpo.SeaPlace.service;

import java.util.List;

import com.uade.tpo.SeaPlace.entity.Favorito;

public interface FavoritoService {

    List<Favorito> getFavoritos();

    Favorito agregarFavorito(Long animalId);

    void quitarFavorito(Long animalId);
}
