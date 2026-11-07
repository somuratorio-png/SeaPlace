package com.uade.tpo.SeaPlace.entity.dto;

import lombok.Data;

@Data
public class ComentarioRequest {
    private String texto;
    // el autor es el usuario del token y la fecha la setea el service (LocalDateTime.now())
}
