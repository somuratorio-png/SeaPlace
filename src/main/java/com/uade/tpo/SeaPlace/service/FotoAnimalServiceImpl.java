package com.uade.tpo.SeaPlace.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.SeaPlace.entity.Animal;
import com.uade.tpo.SeaPlace.entity.FotoAnimal;
import com.uade.tpo.SeaPlace.entity.dto.FotoAnimalRequest;
import com.uade.tpo.SeaPlace.exceptions.RecursoNoEncontradoException;
import com.uade.tpo.SeaPlace.repository.AnimalRepository;
import com.uade.tpo.SeaPlace.repository.FotoAnimalRepository;

@Service
public class FotoAnimalServiceImpl implements FotoAnimalService {

    @Autowired
    private FotoAnimalRepository fotoAnimalRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Override
    public List<FotoAnimal> getFotosByAnimal(Long animalId) {
        return fotoAnimalRepository.findByAnimal_IdAnimalOrderByOrdenAsc(animalId);
    }

    @Override
    public FotoAnimal createFoto(FotoAnimalRequest request) {
        Animal animal = animalRepository.findById(request.getIdAnimal())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el animal con id " + request.getIdAnimal()));

        Integer orden = request.getOrden();

        // Si el refugio no indica posicion, la foto va al final de la galeria para no
        // desordenar las que ya cargo.
        if (orden == null) {
            int cantidadFotosActuales = fotoAnimalRepository
                    .findByAnimal_IdAnimalOrderByOrdenAsc(animal.getIdAnimal()).size();
            orden = cantidadFotosActuales + 1;
        }

        FotoAnimal foto = new FotoAnimal();
        foto.setAnimal(animal);
        foto.setUrlImagen(request.getUrlImagen());
        foto.setOrden(orden);

        return fotoAnimalRepository.save(foto);
    }
}
