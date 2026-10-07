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
            @RequestParam(required = false) Long idRefugio,
            @RequestParam(required = false) Double precioMin,
            @RequestParam(required = false) Double precioMax,
            @RequestParam(required = false) String nombre) {
        PageRequest pageRequest = Paginacion.armar(page, size);
        Page<AnimalResponse> resultado = animalService.getAnimales(estado, idCategoria, idRefugio, precioMin, precioMax, nombre, pageRequest).map(AnimalResponse::fromEntity);
        // Si la pagina no trae elementos, se responde 204 (sin cuerpo) en vez de una pagina vacia.
        if (resultado.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(resultado);
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
