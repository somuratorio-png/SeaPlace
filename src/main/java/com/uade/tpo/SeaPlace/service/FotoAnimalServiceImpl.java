package com.uade.tpo.SeaPlace.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.SeaPlace.entity.Animal;
import com.uade.tpo.SeaPlace.entity.FotoAnimal;
import com.uade.tpo.SeaPlace.entity.dto.FotoAnimalRequest;
import com.uade.tpo.SeaPlace.exceptions.RecursoNoEncontradoException;
import com.uade.tpo.SeaPlace.exceptions.ReglaDeNegocioException;
import com.uade.tpo.SeaPlace.repository.AnimalRepository;
import com.uade.tpo.SeaPlace.repository.FotoAnimalRepository;
import java.util.Objects;
import com.uade.tpo.SeaPlace.exceptions.RecursoDuplicadoException;

@Service
public class FotoAnimalServiceImpl implements FotoAnimalService {

    private static final int LARGO_MAXIMO_URL = 255;

    @Autowired
    private FotoAnimalRepository fotoAnimalRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private AutorizacionService autorizacionService;

    @Override
    public List<FotoAnimal> getFotosByAnimal(Long animalId) {
        animalRepository.findById(animalId)
            .filter(autorizacionService::puedeVerAnimal)
            .orElseThrow(() -> new RecursoNoEncontradoException("No existe el animal con id " + animalId));
        return fotoAnimalRepository.findByAnimal_IdAnimalOrderByOrdenAsc(animalId);
    }

    @Override
    public FotoAnimal createFoto(FotoAnimalRequest request) {
        if (request.getIdAnimal() == null) {
            throw new ReglaDeNegocioException("Debe indicar el animal al que pertenece la foto");
        }

        Animal animal = animalRepository.findById(request.getIdAnimal())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el animal con id " + request.getIdAnimal()));

        // Solo el refugio dueño del animal (o un admin) puede cargarle fotos.
        autorizacionService.validarPermisoSobreRefugio(animal.getRefugio().getIdRefugio());

        String urlImagen = request.getUrlImagen() == null ? "" : request.getUrlImagen().trim();
        if (urlImagen.isEmpty()) {
            throw new ReglaDeNegocioException("La url de la imagen es obligatoria");
        }
        if (urlImagen.length() > LARGO_MAXIMO_URL) {
            throw new ReglaDeNegocioException(
                    "La url de la imagen no puede superar los " + LARGO_MAXIMO_URL + " caracteres");
        }

        // Se aceptan urls completas o rutas del propio sitio (por si el front sirve las imagenes).
        String urlMinuscula = urlImagen.toLowerCase();
        boolean formatoValido = (urlMinuscula.startsWith("http://")
                || urlMinuscula.startsWith("https://")
                || urlImagen.startsWith("/"))
                && urlImagen.chars().noneMatch(Character::isWhitespace);
        if (!formatoValido) {
            throw new ReglaDeNegocioException(
                    "La url de la imagen debe empezar con http://, https:// o / y no tener espacios");
        }

        List<FotoAnimal> fotosActuales = fotoAnimalRepository
                .findByAnimal_IdAnimalOrderByOrdenAsc(animal.getIdAnimal());

        Integer orden = request.getOrden();
        if (orden == null) {
            // Sin posicion: va al final. Se usa el maximo actual (y no la cantidad) para no
            // chocar con un orden ya ocupado si hay huecos en la galeria.
            orden = fotosActuales.stream()
                    .map(FotoAnimal::getOrden)
                    .filter(Objects::nonNull)
                    .mapToInt(Integer::intValue)
                    .max()
                    .orElse(0) + 1;
        } else {
            if (orden < 1) {
                throw new ReglaDeNegocioException("El orden de la foto debe ser mayor a 0");
            }
            for (FotoAnimal fotoExistente : fotosActuales) {
                if (orden.equals(fotoExistente.getOrden())) {
                    throw new RecursoDuplicadoException(
                            "El animal ya tiene una foto en la posicion " + orden);
                }
            }
        }

        FotoAnimal foto = new FotoAnimal();
        foto.setAnimal(animal);
        foto.setUrlImagen(urlImagen);
        foto.setOrden(orden);

        return fotoAnimalRepository.save(foto);
    }
    
}