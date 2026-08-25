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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;

    @ManyToOne
    @JoinColumn(name = "id_rol", nullable = false)
    private Rol rol;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellido;

    @Column(nullable = false, unique = true)
    private String mail;

    @Column(nullable = false, unique = true)
    private String nombreUsuario;

    @Column(nullable = false)
    private String contrasenia;

    @Column(nullable = false)
    private LocalDateTime fechaRegistro;

    @OneToOne(mappedBy = "usuario")
    private Refugio refugio;

    @OneToMany(mappedBy = "usuario")
    private List<Carrito> carritos;

    @OneToMany(mappedBy = "usuario")
    private List<Compra> compras;
}