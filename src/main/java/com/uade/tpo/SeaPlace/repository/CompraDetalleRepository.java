// repository/CompraDetalleRepository.java
package com.uade.tpo.SeaPlace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.SeaPlace.entity.CompraDetalle;

@Repository
public interface CompraDetalleRepository extends JpaRepository<CompraDetalle, Long> {
    List<CompraDetalle> findByCompra_IdCompra(Long idCompra);
}
