
package com.uade.tpo.SeaPlace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.SeaPlace.entity.ZarparDetalle;

@Repository
public interface ZarparDetalleRepository extends JpaRepository<ZarparDetalle, Long> {
    //sirve para "mis ventas" del refugio(?
    List<ZarparDetalle> findByZarpar_IdZarpar(Long idZarpar);

    List<ZarparDetalle> findByAnimal_IdAnimal(Long idAnimal);

    // los pagos de un padrino por un animal, del mas viejo al mas nuevo
    List<ZarparDetalle> findByZarpar_Usuario_IdUsuarioAndAnimal_IdAnimalOrderByZarpar_FechaZarparAsc(Long idUsuario, Long idAnimal);
}
