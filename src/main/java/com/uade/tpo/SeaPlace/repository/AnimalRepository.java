// repository/AnimalRepository.java
package com.uade.tpo.SeaPlace.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.uade.tpo.SeaPlace.entity.Animal;

@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long> {
    @Query("""
        SELECT a FROM Animal a
        WHERE a.estado = :estado
          AND (:idCategoria IS NULL OR a.categoria.idCategoria = :idCategoria)
          AND (:idRefugio IS NULL OR a.refugio.idRefugio = :idRefugio)
          AND (:precioMin IS NULL OR a.cuotaApadrinamiento >= :precioMin)
          AND (:precioMax IS NULL OR a.cuotaApadrinamiento <= :precioMax)
          AND LOWER(a.nombreAnimal) LIKE LOWER(CONCAT('%', :nombre, '%'))
        """)   
    Page<Animal> buscar(@Param("estado") String estado,
                        @Param("idCategoria") Long idCategoria,
                        @Param("idRefugio") Long idRefugio,
                        @Param("precioMin") Double precioMin,
                        @Param("precioMax") Double precioMax,
                        @Param("nombre") String nombre,
                        Pageable pageable);
}
