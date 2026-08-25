// repository/CarritoDetalleRepository.java
package com.uade.tpo.SeaPlace.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.SeaPlace.entity.CarritoDetalle;

@Repository
public interface CarritoDetalleRepository extends JpaRepository<CarritoDetalle, Long> {
    List<CarritoDetalle> findByCarrito_IdCarrito(Long idCarrito);

    Optional<CarritoDetalle> findByCarrito_IdCarritoAndAnimal_IdAnimal(Long idCarrito, Long idAnimal);

    void deleteByCarrito_IdCarritoAndAnimal_IdAnimal(Long idCarrito, Long idAnimal);
}