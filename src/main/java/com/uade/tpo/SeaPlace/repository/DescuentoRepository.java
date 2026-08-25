// repository/DescuentoRepository.java
package com.uade.tpo.SeaPlace.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.uade.tpo.SeaPlace.entity.Descuento;

@Repository
public interface DescuentoRepository extends JpaRepository<Descuento, Long> {
    List<Descuento> findByAnimal_IdAnimalAndActivoTrue(Long idAnimal);

    @Query("select d from Descuento d where d.animal.idAnimal = ?1 and d.activo = true and ?2 between d.fechaInicio and d.fechaFin")
    List<Descuento> findVigentesByAnimal(Long idAnimal, LocalDate fecha);
}
