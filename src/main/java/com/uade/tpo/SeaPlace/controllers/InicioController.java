package com.uade.tpo.SeaPlace.controllers;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.SeaPlace.entity.Plan;
import com.uade.tpo.SeaPlace.entity.dto.AnimalResponse;
import com.uade.tpo.SeaPlace.entity.dto.CategoriaResponse;
import com.uade.tpo.SeaPlace.entity.dto.InicioResponse;
import com.uade.tpo.SeaPlace.entity.dto.PlanResponse;
import com.uade.tpo.SeaPlace.service.AnimalService;
import com.uade.tpo.SeaPlace.service.AutorizacionService;
import com.uade.tpo.SeaPlace.service.CategoriaService;
import com.uade.tpo.SeaPlace.service.SesionService;

@RestController
@RequestMapping("inicio")
public class InicioController {

    @Autowired
    private AnimalService animalService;

    @Autowired
    private CategoriaService categoriaService;

    @Autowired
    private AutorizacionService autorizacionService;

    @Autowired
    private SesionService sesionService;

    // lo que el front pide al abrir la pagina, todo junto: el catalogo (las publicaciones
    // activas, sin paginar), las categorias y los planes. Es publico; si el pedido trae el
    // token de alguien, se suman sus datos (ver SesionResponse).
    @GetMapping
    public ResponseEntity<InicioResponse> getInicio() {
        InicioResponse respuesta = new InicioResponse();
        respuesta.setAnimales(animalService.getAnimales(null, null, null, null, null, null, Paginacion.armar(null, null))
                .map(AnimalResponse::fromEntity).getContent());
        respuesta.setCategorias(categoriaService.getCategorias().stream().map(CategoriaResponse::fromEntity).toList());
        respuesta.setPlanes(Arrays.stream(Plan.values()).map(PlanResponse::fromPlan).toList());
        if (autorizacionService.usuarioActualONull() != null) {
            respuesta.setSesion(sesionService.armarSesion());
        }
        return ResponseEntity.ok(respuesta);
    }
}
