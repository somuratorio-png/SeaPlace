package com.uade.tpo.SeaPlace.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;

// Un animal que un usuario guardo en sus favoritos. La restriccion unica evita
// que el mismo animal quede guardado dos veces para el mismo usuario.
@Data
@Entity
@Table(name = "favorito", uniqueConstraints = @UniqueConstraint(columnNames = { "id_usuario", "id_animal" }))
public class Favorito {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idFavorito;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_animal", nullable = false)
    private Animal animal;
}
