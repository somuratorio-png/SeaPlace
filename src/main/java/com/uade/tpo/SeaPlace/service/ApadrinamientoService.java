package com.uade.tpo.SeaPlace.service;

import java.time.LocalDateTime;
import java.util.List;

import com.uade.tpo.SeaPlace.entity.Animal;
import com.uade.tpo.SeaPlace.entity.Apadrinamiento;
import com.uade.tpo.SeaPlace.entity.Plan;
import com.uade.tpo.SeaPlace.entity.Usuario;
import com.uade.tpo.SeaPlace.entity.ZarparDetalle;

public interface ApadrinamientoService {

    List<Apadrinamiento> getApadrinamientos();

    List<ZarparDetalle> getPagos(Apadrinamiento apadrinamiento);

    Apadrinamiento cambiarPlan(Long apadrinamientoId, String plan);

    Apadrinamiento cancelar(Long apadrinamientoId);

    Apadrinamiento registrar(Usuario usuario, Animal animal, Plan plan, int cupos, LocalDateTime fecha);
}
