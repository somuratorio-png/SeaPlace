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
@Table(name = "animal")
public class Animal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAnimal;

    @ManyToOne
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;

    @ManyToOne
    @JoinColumn(name = "id_refugio", nullable = false)
    private Refugio refugio;

    @Column(nullable = false)
    private String nombreAnimal;

    @Column(nullable = false)
    private Double cuotaApadrinamiento;

    @Column(nullable = false)
    private Integer cuposTotales;

    @Column(nullable = false)
    private Integer cuposDisponibles;

    @Column
    private String descripcion;

    @Column(nullable = false)
    private LocalDateTime fechaPublicacion;

    @Column(nullable = false)
    private String estado;

    // Datos de la ficha que se muestran en el catalogo. Son opcionales: las publicaciones
    // anteriores a estos campos no los tienen.
    @Column
    private String especie;

    @Column
    private String edad;

    @Column
    private String ubicacion;

    // Urgencia medica: CRITICO, RECUPERACION o LISTO.
    @Column
    private String urgencia;

    // Texto corto que acompaña a la urgencia, por ejemplo "Cria huerfana".
    @Column
    private String condicion;

    // Los destacados son los que se muestran en la pagina de inicio. Lo decide un administrador.
    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean destacado = false;

    @OneToMany(mappedBy = "animal")
    private List<FotoAnimal> fotos;

    @OneToMany(mappedBy = "animal")
    private List<UbicacionAnimal> ubicaciones;

    @OneToMany(mappedBy = "animal")
    private List<Descuento> descuentos;

    @OneToMany(mappedBy = "animal")
    private List<MuelleDetalle> muelleDetalles;

    @OneToMany(mappedBy = "animal")
    private List<ZarparDetalle> zarparDetalles;
}
