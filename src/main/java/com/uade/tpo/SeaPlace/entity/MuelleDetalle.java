package com.uade.tpo.SeaPlace.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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

    // Nivel de apadrinamiento elegido. Puede venir vacio en filas anteriores a los planes:
    // en ese caso vale el plan por defecto.
    @Enumerated(EnumType.STRING)
    @Column
    private Plan plan;

    public Plan getPlan() {
        return plan == null ? Plan.POR_DEFECTO : plan;
    }
}