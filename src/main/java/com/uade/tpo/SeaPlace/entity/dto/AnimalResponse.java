package com.uade.tpo.SeaPlace.entity.dto;

import java.time.LocalDateTime;

import com.uade.tpo.SeaPlace.entity.Animal;

import lombok.Data;

@Data
public class AnimalResponse {
    private Long idAnimal;
    private String nombreAnimal;
    private String descripcion;
    private Double cuotaApadrinamiento;
    private Integer cuposTotales;
    private Integer cuposDisponibles;
    private String estado;
    private LocalDateTime fechaPublicacion;
    private Long idCategoria;
    private String nombreCategoria;
    private Long idRefugio;
    private String nombreRefugio;

    public static AnimalResponse fromEntity(Animal animal) {
        AnimalResponse r = new AnimalResponse();
        r.setIdAnimal(animal.getIdAnimal());
        r.setNombreAnimal(animal.getNombreAnimal());
        r.setDescripcion(animal.getDescripcion());
        r.setCuotaApadrinamiento(animal.getCuotaApadrinamiento());
        r.setCuposTotales(animal.getCuposTotales());
        r.setCuposDisponibles(animal.getCuposDisponibles());
        r.setEstado(animal.getEstado());
        r.setFechaPublicacion(animal.getFechaPublicacion());
        if (animal.getCategoria() != null) {
            r.setIdCategoria(animal.getCategoria().getIdCategoria());
            r.setNombreCategoria(animal.getCategoria().getNombreCategoria());
        }
        if (animal.getRefugio() != null) {
            r.setIdRefugio(animal.getRefugio().getIdRefugio());
            r.setNombreRefugio(animal.getRefugio().getNombreRefugio());
        }
        return r;
    }
}
