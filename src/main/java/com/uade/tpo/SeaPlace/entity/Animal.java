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

    // Lo que cuesta por mes el plan Guardian de la Bahia (el plan por defecto). Es la cuota que se
    // muestra en el catalogo y la que usa el filtro por precio.
    @Column(nullable = false)
    private Double cuotaApadrinamiento;

    // Lo que cuestan por mes los otros dos planes: los elige el refugio al publicar. Las publicaciones
    // anteriores a estos campos no los tienen, y para ellas se usa el multiplicador del plan (ver precioDelPlan).
    @Column
    private Double precioBrisaMarina;

    @Column
    private Double precioMareaProfunda;

    // Los cambios que pidio el refugio sobre una publicacion ya aprobada y que todavia no reviso un
    // administrador (un AnimalUpdateRequest en JSON). Mientras tanto se sigue viendo como esta. null = no hay.
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

    // Lo que cuesta por mes un cupo con ese plan, sin descuentos.
    public double precioDelPlan(Plan plan) {
        Double elegido = switch (plan) {
            case BRISA_MARINA -> precioBrisaMarina;
            case GUARDIAN_DE_LA_BAHIA -> cuotaApadrinamiento;
            case MAREA_PROFUNDA -> precioMareaProfunda;
        };
        return elegido != null ? elegido : plan.precioPara(cuotaApadrinamiento);
    }
}
