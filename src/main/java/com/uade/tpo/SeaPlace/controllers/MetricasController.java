package com.uade.tpo.SeaPlace.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.SeaPlace.entity.dto.MetricasResponse;
import com.uade.tpo.SeaPlace.service.MetricasService;

@RestController
@RequestMapping("metricas")
public class MetricasController {

    @Autowired
    private MetricasService metricasService;

    // las metricas comerciales: ingreso recurrente, pagos, bajas, conversion y patrocinadores (solo administrador)
    @GetMapping
    public ResponseEntity<MetricasResponse> getMetricas() {
        return ResponseEntity.ok(metricasService.getMetricas());
    }
}
