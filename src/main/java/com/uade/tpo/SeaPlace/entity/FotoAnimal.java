package com.uade.tpo.SeaPlace.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "foto_animal")
public class FotoAnimal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idFoto;

    @ManyToOne
    @JoinColumn(name = "id_animal", nullable = false)
    private Animal animal;

    @Column(nullable = false)
    private String urlImagen;

    @Column
    private Integer orden;
}
