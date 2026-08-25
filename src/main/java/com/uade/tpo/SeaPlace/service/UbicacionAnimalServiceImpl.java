package com.uade.tpo.SeaPlace.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.SeaPlace.entity.Animal;
import com.uade.tpo.SeaPlace.entity.UbicacionAnimal;
import com.uade.tpo.SeaPlace.entity.dto.UbicacionAnimalRequest;
import com.uade.tpo.SeaPlace.repository.AnimalRepository;
import com.uade.tpo.SeaPlace.repository.UbicacionAnimalRepository;

@Service
public class UbicacionAnimalServiceImpl implements UbicacionAnimalService {

    private static final double LATITUD_MINIMA = -90.0;
    private static final double LATITUD_MAXIMA = 90.0;
    private static final double LONGITUD_MINIMA = -180.0;
    private static final double LONGITUD_MAXIMA = 180.0;

    @Autowired
    private UbicacionAnimalRepository ubicacionAnimalRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Override
    public List<UbicacionAnimal> getHistorial(Long animalId) {
        return ubicacionAnimalRepository.findByAnimal_IdAnimalOrderByFechaHoraDesc(animalId);
    }

    @Override
    public Optional<UbicacionAnimal> getUltimaUbicacion(Long animalId) {
        return ubicacionAnimalRepository.findTopByAnimal_IdAnimalOrderByFechaHoraDesc(animalId);
    }

    @Override
    public UbicacionAnimal registrarUbicacion(UbicacionAnimalRequest request) {
        Animal animal = animalRepository.findById(request.getIdAnimal())
                .orElseThrow(() -> new IllegalArgumentException(
                        "No existe el animal con id " + request.getIdAnimal()));

        Double latitud = request.getLatitud();
        Double longitud = request.getLongitud();

        // Son los rangos validos de coordenadas geograficas: latitud de -90 a 90 y longitud
        // de -180 a 180. Fuera de eso el punto no existe en el mapa.
        if (latitud == null || latitud < LATITUD_MINIMA || latitud > LATITUD_MAXIMA) {
            throw new IllegalArgumentException("La latitud debe estar entre -90 y 90");
        }
        if (longitud == null || longitud < LONGITUD_MINIMA || longitud > LONGITUD_MAXIMA) {
            throw new IllegalArgumentException("La longitud debe estar entre -180 y 180");
        }

        UbicacionAnimal ubicacion = new UbicacionAnimal();
        ubicacion.setAnimal(animal);
        ubicacion.setLatitud(latitud);
        ubicacion.setLongitud(longitud);
        ubicacion.setFechaHora(LocalDateTime.now());

        return ubicacionAnimalRepository.save(ubicacion);
    }
}
