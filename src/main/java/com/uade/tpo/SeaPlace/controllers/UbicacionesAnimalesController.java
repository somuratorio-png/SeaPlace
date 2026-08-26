package com.uade.tpo.SeaPlace.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.SeaPlace.entity.UbicacionAnimal;
import com.uade.tpo.SeaPlace.entity.dto.UbicacionAnimalRequest;
import com.uade.tpo.SeaPlace.entity.dto.UbicacionAnimalResponse;
import com.uade.tpo.SeaPlace.service.UbicacionAnimalService;

@RestController
@RequestMapping("animales/{animalId}/ubicaciones")
public class UbicacionesAnimalesController {

    @Autowired
    private UbicacionAnimalService ubicacionAnimalService;

    @GetMapping
    public ResponseEntity<List<UbicacionAnimalResponse>> getHistorial(@PathVariable Long animalId) {
        return ResponseEntity.ok(ubicacionAnimalService.getHistorial(animalId).stream().map(UbicacionAnimalResponse::fromEntity).toList());
    }

    @GetMapping("/ultima")
    public ResponseEntity<UbicacionAnimalResponse> getUltimaUbicacion(@PathVariable Long animalId) {
        return ubicacionAnimalService.getUltimaUbicacion(animalId)
                .map(u -> ResponseEntity.ok(UbicacionAnimalResponse.fromEntity(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UbicacionAnimalResponse> registrarUbicacion(@PathVariable Long animalId, @RequestBody UbicacionAnimalRequest request) {
        request.setIdAnimal(animalId);
        UbicacionAnimal result = ubicacionAnimalService.registrarUbicacion(request);
        return ResponseEntity.ok(UbicacionAnimalResponse.fromEntity(result));
    }
}
