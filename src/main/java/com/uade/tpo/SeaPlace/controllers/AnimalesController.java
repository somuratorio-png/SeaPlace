package com.uade.tpo.SeaPlace.controllers;

import java.net.URI;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.SeaPlace.entity.Animal;
import com.uade.tpo.SeaPlace.entity.dto.AnimalRequest;
import com.uade.tpo.SeaPlace.entity.dto.AnimalResponse;
import com.uade.tpo.SeaPlace.entity.dto.AnimalUpdateRequest;
import com.uade.tpo.SeaPlace.service.AnimalService;

@RestController
@RequestMapping("animales")
public class AnimalesController {

    @Autowired
    private AnimalService animalService;

    @GetMapping
    public ResponseEntity<Page<AnimalResponse>> getAnimales(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) Long idCategoria,
            @RequestParam(required = false) Double precioMin,
            @RequestParam(required = false) Double precioMax) {
        PageRequest pageRequest = (page == null || size == null)
                ? PageRequest.of(0, Integer.MAX_VALUE)
                : PageRequest.of(page, size);
        return ResponseEntity.ok(animalService.getAnimales(estado, idCategoria, precioMin, precioMax, pageRequest).map(AnimalResponse::fromEntity));
    }

    @GetMapping("/{animalId}")
    public ResponseEntity<AnimalResponse> getAnimalById(@PathVariable Long animalId) {
        Optional<Animal> result = animalService.getAnimalById(animalId);
        return result.map(a -> ResponseEntity.ok(AnimalResponse.fromEntity(a))).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AnimalResponse> createAnimal(@RequestBody AnimalRequest request) {
        Animal result = animalService.createAnimal(request);
        return ResponseEntity.created(URI.create("/animales/" + result.getIdAnimal())).body(AnimalResponse.fromEntity(result));
    }

    @PutMapping("/{animalId}")
    public ResponseEntity<AnimalResponse> updateAnimal(@PathVariable Long animalId, @RequestBody AnimalUpdateRequest request) {
        return ResponseEntity.ok(AnimalResponse.fromEntity(animalService.updateAnimal(animalId, request)));
    }

    @DeleteMapping("/{animalId}")
    public ResponseEntity<Void> deleteAnimal(@PathVariable Long animalId) {
        animalService.deleteAnimal(animalId);
        return ResponseEntity.noContent().build();
    }
}
