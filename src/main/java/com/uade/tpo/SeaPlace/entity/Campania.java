package com.uade.tpo.SeaPlace.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

// Una campaña de duplicacion: mientras esta vigente, por cada dolar que un padrino aporta para el animal,
// el patrocinador pone otro, hasta llegar al tope. "aportado" es lo que el patrocinador ya puso.
// Un animal tiene a lo sumo una campaña activa a la vez.
@Data
@Entity
@Table(name = "campania")
public class Campania {
    private static final String PUBLICACION_ACTIVA = "ACTIVA";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCampania;

    @ManyToOne
    @JoinColumn(name = "id_patrocinador", nullable = false)
    private Patrocinador patrocinador;

    @ManyToOne
    @JoinColumn(name = "id_animal", nullable = false)
    private Animal animal;

    // En dolares, como las cuotas
    @Column(nullable = false)
    private Double tope;

    @Column(nullable = false)
    private Double aportado = 0.0;

    @Column(nullable = false)
    private LocalDate fechaInicio;

    @Column(nullable = false)
    private LocalDate fechaFin;

    // false cuando el patrocinador la da por terminada antes de tiempo
    @Column(nullable = false)
    private boolean activa = true;

    // Lo que todavia puede duplicar
    public double restante() {
        return Math.max(0, Math.round((tope - aportado) * 100.0) / 100.0);
    }

    // Duplica aportes hoy: esta activa, dentro de sus fechas, le queda tope y el animal sigue publicado
    public boolean estaVigente(LocalDate hoy) {
        return activa
                && !hoy.isBefore(fechaInicio)
                && !hoy.isAfter(fechaFin)
                && restante() > 0
                && animal != null
                && PUBLICACION_ACTIVA.equals(animal.getEstado());
    }
}
