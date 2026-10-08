package com.uade.tpo.SeaPlace.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.SeaPlace.entity.Animal;
import com.uade.tpo.SeaPlace.entity.Novedad;
import com.uade.tpo.SeaPlace.entity.dto.NovedadRequest;
import com.uade.tpo.SeaPlace.exceptions.RecursoNoEncontradoException;
import com.uade.tpo.SeaPlace.exceptions.ReglaDeNegocioException;
import com.uade.tpo.SeaPlace.repository.AnimalRepository;
import com.uade.tpo.SeaPlace.repository.NovedadRepository;

@Service
public class NovedadServiceImpl implements NovedadService {

    private static final int LARGO_MAXIMO = 1000;

    @Autowired
    private NovedadRepository novedadRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private AutorizacionService autorizacionService;

    @Override
    public List<Novedad> getNovedades(Long animalId) {
        animalRepository.findById(animalId)
                .filter(autorizacionService::puedeVerAnimal)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el animal con id " + animalId));

        return novedadRepository.findByAnimal_IdAnimalOrderByFechaDesc(animalId);
    }

    @Override
    public Novedad createNovedad(Long animalId, NovedadRequest request) {
        Animal animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el animal con id " + animalId));

        // Solo el refugio dueño del animal (o un admin) puede publicarle novedades.
        autorizacionService.validarPermisoSobreRefugio(animal.getRefugio().getIdRefugio());

        String texto = request.getTexto() == null ? "" : request.getTexto().trim();
        if (texto.isEmpty()) {
            throw new ReglaDeNegocioException("El texto de la novedad es obligatorio");
        }
        if (texto.length() > LARGO_MAXIMO) {
            throw new ReglaDeNegocioException(
                    "El texto de la novedad no puede superar los " + LARGO_MAXIMO + " caracteres");
        }

        Novedad novedad = new Novedad();
        novedad.setAnimal(animal);
        novedad.setTexto(texto);
        novedad.setFecha(LocalDateTime.now());

        return novedadRepository.save(novedad);
    }
}
