package com.uade.tpo.SeaPlace.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.SeaPlace.entity.dto.BeneficioResponse;
import com.uade.tpo.SeaPlace.entity.dto.CampaniaRequest;
import com.uade.tpo.SeaPlace.entity.dto.MiPatrocinioResponse;
import com.uade.tpo.SeaPlace.entity.dto.PatrocinadorPerfilRequest;
import com.uade.tpo.SeaPlace.entity.dto.PatrocinadorResponse;
import com.uade.tpo.SeaPlace.service.PatrocinadorService;

// /patrocinadores es publico ("Nos acompañan"). /beneficios es para quienes apadrinan.
// /me y sus campañas son del patrocinador logueado: los cambios devuelven su panel completo,
// porque crear o terminar una campaña tambien cambia su nivel y su impacto.
@RestController
@RequestMapping("patrocinadores")
public class PatrocinadoresController {

    @Autowired
    private PatrocinadorService patrocinadorService;

    @GetMapping
    public ResponseEntity<List<PatrocinadorResponse>> getPatrocinadores() {
        List<PatrocinadorResponse> resultado = patrocinadorService.getPatrocinadores();
        // Si no hay nada para devolver, se responde 204 (sin cuerpo) en vez de un array vacio.
        if (resultado.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/beneficios")
    public ResponseEntity<List<BeneficioResponse>> getBeneficios() {
        List<BeneficioResponse> resultado = patrocinadorService.getBeneficios();
        if (resultado.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/me")
    public ResponseEntity<MiPatrocinioResponse> getMiPatrocinio() {
        return ResponseEntity.ok(patrocinadorService.getMiPatrocinio());
    }

    @PutMapping("/me")
    public ResponseEntity<MiPatrocinioResponse> modificarMiPerfil(@RequestBody PatrocinadorPerfilRequest request) {
        return ResponseEntity.ok(patrocinadorService.modificarMiPerfil(request));
    }

    @PostMapping("/me/campanias")
    public ResponseEntity<MiPatrocinioResponse> crearCampania(@RequestBody CampaniaRequest request) {
        return ResponseEntity.ok(patrocinadorService.crearCampania(request));
    }

    // No borra la campaña: la da por terminada (lo ya duplicado sigue contando)
    @DeleteMapping("/me/campanias/{campaniaId}")
    public ResponseEntity<MiPatrocinioResponse> finalizarCampania(@PathVariable Long campaniaId) {
        return ResponseEntity.ok(patrocinadorService.finalizarCampania(campaniaId));
    }
}
