package com.uade.tpo.SeaPlace.entity;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "rol")
public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idRol;

    @Column(nullable = false, unique = true)
    private String nombreRol;

    @OneToMany(mappedBy = "rol")
    private List<Usuario> usuarios;

    // EAGER a proposito: Usuario.getAuthorities() lee esta lista dentro del filtro de
    // seguridad (JwtAuthenticationFilter), antes de que exista una sesion de Hibernate abierta
    // por Open Session In View (que recien arranca en el dispatch de MVC). Con LAZY, esa lectura
    // tira LazyInitializationException ("no session"). Son pocos permisos por rol, el costo de
    // traerlos siempre es despreciable.
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "rol_permiso",
            joinColumns = @JoinColumn(name = "id_rol"),
            inverseJoinColumns = @JoinColumn(name = "id_permiso"))
    private List<Permiso> permisos;
}