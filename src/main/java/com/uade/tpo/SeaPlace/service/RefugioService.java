package com.uade.tpo.SeaPlace.service;

import java.util.List;
import java.util.Optional;

import com.uade.tpo.SeaPlace.entity.Refugio;
import com.uade.tpo.SeaPlace.entity.dto.RefugioRequest;

public interface RefugioService {
    List<Refugio> getRefugios();

    Optional<Refugio> getRefugioById(Long refugioId);

    Refugio createRefugio(RefugioRequest request);
}
