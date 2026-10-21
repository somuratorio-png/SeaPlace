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
    private SesionResponse sesion;
}
