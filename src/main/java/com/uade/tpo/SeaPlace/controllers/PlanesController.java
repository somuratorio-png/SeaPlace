package com.uade.tpo.SeaPlace.controllers;

import java.util.Arrays;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.SeaPlace.entity.Plan;
import com.uade.tpo.SeaPlace.entity.dto.PlanResponse;

@RestController
@RequestMapping("planes")
public class PlanesController {

    // los niveles de apadrinamiento, del mas barato al mas caro (son fijos, no hay alta ni baja)
    @GetMapping
    public ResponseEntity<List<PlanResponse>> getPlanes() {
        return ResponseEntity.ok(Arrays.stream(Plan.values()).map(PlanResponse::fromPlan).toList());
    }
}
