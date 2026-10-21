package com.uade.tpo.SeaPlace.controllers;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.SeaPlace.entity.Plan;
import com.uade.tpo.SeaPlace.entity.dto.InicioResponse;
import com.uade.tpo.SeaPlace.entity.dto.PlanResponse;
import com.uade.tpo.SeaPlace.service.AutorizacionService;
import com.uade.tpo.SeaPlace.service.SesionService;

@RestController
@RequestMapping("inicio")
public class InicioController {

    @Autowired
    private AutorizacionService autorizacionService;

    @Autowired
    private SesionService sesionService;

    @GetMapping
    public ResponseEntity<InicioResponse> getInicio() {
        InicioResponse respuesta = new InicioResponse();
        respuesta.setPlanes(Arrays.stream(Plan.values()).map(PlanResponse::fromPlan).toList());
        if (autorizacionService.usuarioActualONull() != null) {
            respuesta.setSesion(sesionService.armarSesion());
        }
        return ResponseEntity.ok(respuesta);
    }
}
