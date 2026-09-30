package com.uade.tpo.SeaPlace.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "zarpar")
public class Zarpar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idZarpar;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private LocalDateTime fechaZarpar;

    @Column(nullable = false)
    private Double total;

    @Column(nullable = false)
    private String estado;

    @OneToMany(mappedBy = "zarpar")
    private List<ZarparDetalle> detalles;
}