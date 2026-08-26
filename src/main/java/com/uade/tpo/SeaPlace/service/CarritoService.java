package com.uade.tpo.SeaPlace.service;

import java.util.List;

import com.uade.tpo.SeaPlace.entity.Carrito;
import com.uade.tpo.SeaPlace.entity.CarritoDetalle;
import com.uade.tpo.SeaPlace.entity.dto.CarritoDetalleRequest;

public interface CarritoService {
    Carrito getOrCreateCarritoActivo(Long idUsuario);

    CarritoDetalle agregarItem(CarritoDetalleRequest request);

    CarritoDetalle modificarCantidad(Long carritoId, Long animalId, Integer cantidad);

    void quitarItem(Long carritoId, Long animalId);

    List<CarritoDetalle> getItems(Long carritoId);
}
