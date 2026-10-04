package com.uade.tpo.SeaPlace.controllers.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

import com.uade.tpo.SeaPlace.service.RecuperacionContraseniaService;
import com.uade.tpo.SeaPlace.service.AuthenticationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;
    private final RecuperacionContraseniaService recuperacionService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/register-refugio")
    public ResponseEntity<AuthenticationResponse> registerRefugio(@RequestBody RegisterRefugioRequest request) {
        return ResponseEntity.ok(service.registerRefugio(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PostMapping("/olvide-contrasenia")
    public ResponseEntity<Map<String, String>> olvideContrasenia(@RequestBody OlvideContraseniaRequest request) {
        recuperacionService.solicitarCodigo(request.getMail());
        // La misma respuesta exista o no el mail, para no revelar que mails estan registrados.
        return ResponseEntity.ok(Map.of("mensaje",
                "Si el mail esta registrado, te enviamos las instrucciones para restablecer tu contrasenia"));
    }

    @PostMapping("/restablecer-contrasenia")
    public ResponseEntity<Void> restablecerContrasenia(@RequestBody RestablecerContraseniaRequest request) {
        recuperacionService.restablecer(request.getMail(), request.getCodigo(), request.getContraseniaNueva());
        return ResponseEntity.noContent().build();
    }
}