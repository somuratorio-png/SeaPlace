package com.uade.tpo.SeaPlace.entity;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "refugio")
public class Refugio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idRefugio;

    @OneToOne
    @JoinColumn(name = "id_usuario", nullable = false, unique = true)
    private Usuario usuario;

    @Column(nullable = false)
    private String nombreRefugio;

    @Column
    private String descripcion;

    // Un refugio que se registra solo queda pendiente hasta que un administrador lo aprueba;
    // mientras tanto no puede publicar animales.
    @Column(nullable = false, columnDefinition = "boolean default true")
    private boolean aprobado = true;

    @OneToMany(mappedBy = "refugio")
    private List<Animal> animales;
}