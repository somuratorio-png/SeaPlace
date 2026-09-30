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
@Table(name = "muelle_detalle")
public class MuelleDetalle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMuelleDetalle;

    @ManyToOne
    @JoinColumn(name = "id_animal", nullable = false)
    private Animal animal;

    @ManyToOne
    @JoinColumn(name = "id_muelle", nullable = false)
    private Muelle muelle;

    @Column(nullable = false)
    private Double precioUnitario;

    @Column(nullable = false)
    private Integer cantidad;
}