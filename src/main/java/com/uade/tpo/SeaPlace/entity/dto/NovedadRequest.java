package com.uade.tpo.SeaPlace.entity.dto;

import lombok.Data;

@Data
public class NovedadRequest {
    private String texto;
    // la fecha la setea el service (LocalDateTime.now())
}
