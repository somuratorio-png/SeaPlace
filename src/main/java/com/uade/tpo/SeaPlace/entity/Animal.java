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

    @Column
    private Double precioBrisaMarina;

    @Column
    private Double precioMareaProfunda;

    @Column(columnDefinition = "TEXT")
    private String cambioPendiente;

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

    @Column
    private String especie;

    @Column
    private String edad;

    @Column
    private String ubicacion;

    @Column
    private String urgencia;

    @Column
    private String condicion;

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

    public double precioDelPlan(Plan plan) {
        Double elegido = switch (plan) {
            case BRISA_MARINA -> precioBrisaMarina;
            case GUARDIAN_DE_LA_BAHIA -> cuotaApadrinamiento;
            case MAREA_PROFUNDA -> precioMareaProfunda;
        };
        return elegido != null ? elegido : plan.precioPara(cuotaApadrinamiento);
    }
}
