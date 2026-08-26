package com.uade.tpo.SeaPlace.controllers;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.SeaPlace.entity.FotoAnimal;
import com.uade.tpo.SeaPlace.entity.dto.FotoAnimalRequest;
import com.uade.tpo.SeaPlace.entity.dto.FotoAnimalResponse;
import com.uade.tpo.SeaPlace.service.FotoAnimalService;

@RestController
@RequestMapping("animales/{animalId}/fotos")
public class FotosAnimalesController {

    @Autowired
    private FotoAnimalService fotoAnimalService;

    @GetMapping
    public ResponseEntity<List<FotoAnimalResponse>> getFotos(@PathVariable Long animalId) {
        return ResponseEntity.ok(fotoAnimalService.getFotosByAnimal(animalId).stream().map(FotoAnimalResponse::fromEntity).toList());
    }

    @PostMapping
    public ResponseEntity<FotoAnimalResponse> addFoto(@PathVariable Long animalId, @RequestBody FotoAnimalRequest request) {
        request.setIdAnimal(animalId);
        FotoAnimal result = fotoAnimalService.createFoto(request);
        return ResponseEntity.created(URI.create("/animales/" + animalId + "/fotos/" + result.getIdFoto())).body(FotoAnimalResponse.fromEntity(result));
    }
}
