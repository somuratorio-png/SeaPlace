package com.uade.tpo.SeaPlace.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import com.uade.tpo.SeaPlace.entity.Compra;
import com.uade.tpo.SeaPlace.entity.dto.CompraRequest;

public interface CompraService {
    Page<Compra> getComprasByUsuario(Long idUsuario, PageRequest pageRequest);

    Optional<Compra> getCompraById(Long compraId);

    Compra confirmarCompra(CompraRequest request);
}