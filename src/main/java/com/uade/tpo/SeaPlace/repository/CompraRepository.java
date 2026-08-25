// repository/CompraRepository.java
package com.uade.tpo.SeaPlace.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.SeaPlace.entity.Compra;

@Repository
public interface CompraRepository extends JpaRepository<Compra, Long> {
    Page<Compra> findByUsuario_IdUsuario(Long idUsuario, Pageable pageable);

    Page<Compra> findByUsuario_IdUsuarioAndEstado(Long idUsuario, String estado, Pageable pageable);
}
