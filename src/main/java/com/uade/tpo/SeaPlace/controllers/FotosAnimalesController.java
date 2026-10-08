package com.uade.tpo.SeaPlace.controllers;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.uade.tpo.SeaPlace.entity.ArchivoFoto;
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
        List<FotoAnimalResponse> resultado = fotoAnimalService.getFotosByAnimal(animalId).stream().map(FotoAnimalResponse::fromEntity).toList();
        // Si no hay nada para devolver, se responde 204 (sin cuerpo) en vez de un array vacio.
        if (resultado.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(resultado);
    }

    @PostMapping
    public ResponseEntity<FotoAnimalResponse> addFoto(@PathVariable Long animalId, @RequestBody FotoAnimalRequest request) {
        request.setIdAnimal(animalId);
        FotoAnimal result = fotoAnimalService.createFoto(request);
        return ResponseEntity.created(URI.create("/animales/" + animalId + "/fotos/" + result.getIdFoto())).body(FotoAnimalResponse.fromEntity(result));
    }

    // sube la foto como archivo (multipart, campo "archivo") en vez de indicar una url
    @PostMapping(path = "/archivo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FotoAnimalResponse> subirFoto(@PathVariable Long animalId, @RequestParam("archivo") MultipartFile archivo) {
        FotoAnimal result = fotoAnimalService.subirFoto(animalId, archivo);
        return ResponseEntity.created(URI.create(result.getUrlImagen())).body(FotoAnimalResponse.fromEntity(result));
    }

    // devuelve la imagen de una foto subida como archivo (es a donde apunta su urlImagen)
    @GetMapping("/{fotoId}/archivo")
    public ResponseEntity<byte[]> getArchivo(@PathVariable Long animalId, @PathVariable Long fotoId) {
        ArchivoFoto archivo = fotoAnimalService.getArchivo(animalId, fotoId);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(archivo.getTipoContenido()))
                .body(archivo.getContenido());
    }
}
