package com.uade.tpo.SeaPlace.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.SeaPlace.entity.Animal;
import com.uade.tpo.SeaPlace.entity.Descuento;
import com.uade.tpo.SeaPlace.entity.dto.DescuentoRequest;
import com.uade.tpo.SeaPlace.exceptions.RecursoNoEncontradoException;
import com.uade.tpo.SeaPlace.exceptions.ReglaDeNegocioException;
import com.uade.tpo.SeaPlace.repository.AnimalRepository;
import com.uade.tpo.SeaPlace.repository.DescuentoRepository;

@Service
public class DescuentoServiceImpl implements DescuentoService {

    @Autowired
    private DescuentoRepository descuentoRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Override
    public List<Descuento> getDescuentosActivos(Long animalId) {
        return descuentoRepository.findByAnimal_IdAnimalAndActivoTrue(animalId);
    }

    @Override
    public Descuento createDescuento(DescuentoRequest request) {
        Animal animal = animalRepository.findById(request.getIdAnimal())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el animal con id " + request.getIdAnimal()));

        // Un descuento de 0% no descuenta nada y uno mayor a 100% dejaria la cuota negativa:
        // solo tiene sentido en el rango (0, 100].
        if (request.getPorcentaje() == null || request.getPorcentaje() <= 0 || request.getPorcentaje() > 100) {
            throw new ReglaDeNegocioException("El porcentaje debe ser mayor a 0 y hasta 100");
        }

        if (request.getFechaInicio() == null || request.getFechaFin() == null) {
            throw new ReglaDeNegocioException("La fecha de inicio y la fecha de fin son obligatorias");
        }

        // Una campania no puede terminar antes de empezar; nunca estaria vigente.
        if (request.getFechaFin().isBefore(request.getFechaInicio())) {
            throw new ReglaDeNegocioException("La fecha de fin no puede ser anterior a la fecha de inicio");
        }

        Descuento descuento = new Descuento();
        descuento.setAnimal(animal);
        descuento.setPorcentaje(request.getPorcentaje());
        descuento.setFechaInicio(request.getFechaInicio());
        descuento.setFechaFin(request.getFechaFin());

        // Un descuento nace activo: si el refugio lo carga es para que aplique de inmediato
        // dentro de su rango de fechas.
        descuento.setActivo(true);

        return descuentoRepository.save(descuento);
    }
}
