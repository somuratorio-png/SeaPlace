package com.uade.tpo.SeaPlace.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.uade.tpo.SeaPlace.entity.ArchivoFoto;
import com.uade.tpo.SeaPlace.entity.FotoAnimal;
import com.uade.tpo.SeaPlace.entity.dto.FotoAnimalRequest;

public interface FotoAnimalService {
    List<FotoAnimal> getFotosByAnimal(Long animalId);

    FotoAnimal createFoto(FotoAnimalRequest request);

    FotoAnimal subirFoto(Long animalId, MultipartFile archivo);

    ArchivoFoto getArchivo(Long animalId, Long fotoId);
}
