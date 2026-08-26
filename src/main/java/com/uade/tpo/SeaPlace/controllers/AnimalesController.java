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
import com.uade.tpo.SeaPlace.entity.dto.AnimalUpdateRequest;
import com.uade.tpo.SeaPlace.service.AnimalService;

@RestController
@RequestMapping("animales")
public class AnimalesController {

    @Autowired
    private AnimalService animalService;

    @GetMapping
    public ResponseEntity<Page<Animal>> getAnimales(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String estado) {
        PageRequest pageRequest = (page == null || size == null)
                ? PageRequest.of(0, Integer.MAX_VALUE)
                : PageRequest.of(page, size);
        return ResponseEntity.ok(animalService.getAnimales(estado, pageRequest));
    }

    @GetMapping("/{animalId}")
    public ResponseEntity<Animal> getAnimalById(@PathVariable Long animalId) {
        Optional<Animal> result = animalService.getAnimalById(animalId);
        return result.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Animal> createAnimal(@RequestBody AnimalRequest request) {
        Animal result = animalService.createAnimal(request);
        return ResponseEntity.created(URI.create("/animales/" + result.getIdAnimal())).body(result);
    }

    @PutMapping("/{animalId}")
    public ResponseEntity<Animal> updateAnimal(@PathVariable Long animalId, @RequestBody AnimalUpdateRequest request) {
        return ResponseEntity.ok(animalService.updateAnimal(animalId, request));
    }

    @DeleteMapping("/{animalId}")
    public ResponseEntity<Void> deleteAnimal(@PathVariable Long animalId) {
        animalService.deleteAnimal(animalId);
        return ResponseEntity.noContent().build();
    }
}