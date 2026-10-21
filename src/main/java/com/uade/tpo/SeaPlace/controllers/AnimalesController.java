package com.uade.tpo.SeaPlace.controllers;

import java.net.URI;
import java.util.List;
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
import com.uade.tpo.SeaPlace.entity.dto.CambioPendienteResponse;
import com.uade.tpo.SeaPlace.entity.dto.RechazoRequest;
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
        if (resultado.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/cambios-pendientes")
    public ResponseEntity<List<CambioPendienteResponse>> getCambiosPendientes() {
        List<CambioPendienteResponse> resultado = animalService.getCambiosPendientes();
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

    @PutMapping("/{animalId}/aprobar")
    public ResponseEntity<AnimalResponse> aprobarAnimal(@PathVariable Long animalId) {
        return ResponseEntity.ok(AnimalResponse.fromEntity(animalService.aprobarAnimal(animalId)));
    }

    @PutMapping("/{animalId}/rechazar")
    public ResponseEntity<Void> rechazarAnimal(@PathVariable Long animalId, @RequestBody(required = false) RechazoRequest request) {
        animalService.rechazarAnimal(animalId, request == null ? null : request.getMotivo());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{animalId}/cambios/aprobar")
    public ResponseEntity<AnimalResponse> aprobarCambios(@PathVariable Long animalId) {
        return ResponseEntity.ok(AnimalResponse.fromEntity(animalService.aprobarCambios(animalId)));
    }

    @PutMapping("/{animalId}/cambios/rechazar")
    public ResponseEntity<AnimalResponse> rechazarCambios(@PathVariable Long animalId, @RequestBody(required = false) RechazoRequest request) {
        return ResponseEntity.ok(AnimalResponse.fromEntity(animalService.rechazarCambios(animalId, request == null ? null : request.getMotivo())));
    }

    @DeleteMapping("/{animalId}")
    public ResponseEntity<Void> deleteAnimal(@PathVariable Long animalId) {
        animalService.deleteAnimal(animalId);
        return ResponseEntity.noContent().build();
    }
}
