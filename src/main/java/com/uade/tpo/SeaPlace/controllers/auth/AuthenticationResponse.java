package com.uade.tpo.SeaPlace.controllers.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.uade.tpo.SeaPlace.entity.dto.SesionResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {
    @JsonProperty("access_token")
    private String accessToken;
    // Los datos de quien acaba de entrar, para que el cliente no tenga que pedirlos aparte.
    private SesionResponse sesion;
}
