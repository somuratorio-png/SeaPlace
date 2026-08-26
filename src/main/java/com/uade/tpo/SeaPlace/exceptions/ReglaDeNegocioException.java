package com.uade.tpo.SeaPlace.exceptions;

public class ReglaDeNegocioException extends RuntimeException {
    public ReglaDeNegocioException(String mensaje) {
        super(mensaje);
    }
}