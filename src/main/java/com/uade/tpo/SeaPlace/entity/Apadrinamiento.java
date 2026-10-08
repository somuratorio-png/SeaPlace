package com.uade.tpo.SeaPlace.entity;

import java.time.LocalDateTime;

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

// El vinculo vivo entre un padrino y un animal: se crea al confirmar un zarpar y dura
// hasta que el padrino lo cancela. Un zarpar es un pago; el apadrinamiento es lo que
// queda despues (con que plan, cuantos cupos y desde cuando).
@Data
@Entity
@Table(name = "apadrinamiento")
public class Apadrinamiento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idApadrinamiento;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_animal", nullable = false)
    private Animal animal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Plan plan;

    // Cuantos cupos del animal tiene tomados este padrino.
    @Column(nullable = false)
    private Integer cupos;

    @Column(nullable = false)
    private LocalDateTime fechaInicio;

    // Al cancelar no se borra: queda inactivo, asi se conserva el historial.
    @Column(nullable = false)
    private boolean activo = true;

    private LocalDateTime fechaCancelacion;
}
