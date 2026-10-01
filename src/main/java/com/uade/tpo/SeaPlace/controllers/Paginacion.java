package com.uade.tpo.SeaPlace.controllers;

import org.springframework.data.domain.PageRequest;

import com.uade.tpo.SeaPlace.exceptions.ReglaDeNegocioException;

// Arma el PageRequest a partir de los parametros page y size del request.
public final class Paginacion {

    private static final int TAMANIO_POR_DEFECTO = 20;

    private Paginacion() {
    }

    public static PageRequest armar(Integer page, Integer size) {
        // Sin ninguno de los dos: sin paginar (devuelve todo en una sola pagina).
        if (page == null && size == null) {
            return PageRequest.of(0, Integer.MAX_VALUE);
        }

        // Si viene solo uno, el otro toma un valor por defecto.
        int pagina = (page == null) ? 0 : page;
        int tamanio = (size == null) ? TAMANIO_POR_DEFECTO : size;

        if (pagina < 0) {
            throw new ReglaDeNegocioException("El parametro 'page' no puede ser negativo");
        }
        if (tamanio < 1) {
            throw new ReglaDeNegocioException("El parametro 'size' debe ser mayor a 0");
        }

        return PageRequest.of(pagina, tamanio);
    }
}