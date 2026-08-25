// repository/AnimalRepository.java
package com.uade.tpo.SeaPlace.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.SeaPlace.entity.Animal;

@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long> {
    Page<Animal> findByEstado(String estado, Pageable pageable);

    List<Animal> findByCategoria_IdCategoria(Long idCategoria);

    List<Animal> findByRefugio_IdRefugio(Long idRefugio);

    List<Animal> findByCuposDisponiblesGreaterThan(Integer cupos);
}