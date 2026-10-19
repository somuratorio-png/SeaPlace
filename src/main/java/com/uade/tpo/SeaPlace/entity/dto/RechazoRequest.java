package com.uade.tpo.SeaPlace.entity.dto;

import lombok.Data;

// Lo que manda un administrador al rechazar una publicacion. El motivo es opcional: si viene, le llega al refugio.
@Data
public class RechazoRequest {
    private String motivo;
}
