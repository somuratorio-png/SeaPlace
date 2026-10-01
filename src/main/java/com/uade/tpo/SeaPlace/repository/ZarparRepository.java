package com.uade.tpo.SeaPlace.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.SeaPlace.entity.Zarpar;

@Repository
public interface ZarparRepository extends JpaRepository<Zarpar, Long> {
    Page<Zarpar> findByUsuario_IdUsuario(Long idUsuario, Pageable pageable);
}
