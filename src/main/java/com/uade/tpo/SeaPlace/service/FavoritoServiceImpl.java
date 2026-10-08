package com.uade.tpo.SeaPlace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.SeaPlace.entity.Animal;
import com.uade.tpo.SeaPlace.entity.Favorito;
import com.uade.tpo.SeaPlace.entity.Usuario;
import com.uade.tpo.SeaPlace.exceptions.RecursoNoEncontradoException;
import com.uade.tpo.SeaPlace.repository.AnimalRepository;
import com.uade.tpo.SeaPlace.repository.FavoritoRepository;

// Los favoritos son siempre los del usuario logueado (el del token): nadie ve ni toca los de otro.
@Service
public class FavoritoServiceImpl implements FavoritoService {

    @Autowired
    private FavoritoRepository favoritoRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private AutorizacionService autorizacionService;

    @Override
    public List<Favorito> getFavoritos() {
        return favoritoRepository.findByUsuario_IdUsuario(autorizacionService.idUsuarioActual());
    }

    @Override
    public Favorito agregarFavorito(Long animalId) {
        Usuario usuario = autorizacionService.usuarioActual();

        Animal animal = animalRepository.findById(animalId)
                .filter(autorizacionService::puedeVerAnimal)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el animal con id " + animalId));

        // Guardar dos veces el mismo animal no es un error: se devuelve el que ya estaba.
        Optional<Favorito> existente = favoritoRepository
                .findByUsuario_IdUsuarioAndAnimal_IdAnimal(usuario.getIdUsuario(), animalId);
        if (existente.isPresent()) {
            return existente.get();
        }

        Favorito favorito = new Favorito();
        favorito.setUsuario(usuario);
        favorito.setAnimal(animal);
        return favoritoRepository.save(favorito);
    }

    @Override
    public void quitarFavorito(Long animalId) {
        // Si no estaba en favoritos no hay nada que hacer.
        favoritoRepository
                .findByUsuario_IdUsuarioAndAnimal_IdAnimal(autorizacionService.idUsuarioActual(), animalId)
                .ifPresent(favoritoRepository::delete);
    }
}
