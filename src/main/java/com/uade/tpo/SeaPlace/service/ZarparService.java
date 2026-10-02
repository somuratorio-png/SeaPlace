package com.uade.tpo.SeaPlace.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import com.uade.tpo.SeaPlace.entity.Zarpar;
import com.uade.tpo.SeaPlace.entity.dto.ZarparRequest;

public interface ZarparService {
    Page<Zarpar> getZarparsByUsuario(Long idUsuario, PageRequest pageRequest);

    Optional<Zarpar> getZarparById(Long zarparId);

    Zarpar confirmarZarpar(Long idUsuario, ZarparRequest request);
}