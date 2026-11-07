package com.uade.tpo.SeaPlace.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

// Una empresa o marca que apoya a SeaPlace. Su cuenta (un Usuario con rol patrocinador) arma campañas
// que duplican los aportes de los padrinos (ver Campania), y a cambio aparece en el sitio con su marca.
// Tambien puede ofrecer un beneficio (un cupon) para quienes apadrinan.
@Data
@Entity
@Table(name = "patrocinador")
public class Patrocinador {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPatrocinador;

    @OneToOne
    @JoinColumn(name = "id_usuario", nullable = false, unique = true)
    private Usuario usuario;

    @Column(nullable = false, unique = true)
    private String nombreEmpresa;

    @Column(length = 500)
    private String descripcion;

    @Column
    private String sitioWeb;

    // El simbolo que acompaña su nombre en el sitio (un nombre de Material Symbols, por ejemplo "local_cafe")
    @Column(nullable = false, columnDefinition = "varchar(255) default 'storefront'")
    private String icono = "storefront";

    // Lo que le ofrece a quienes apadrinan (por ejemplo "20% off en tu primera compra") y el codigo para usarlo.
    // El codigo solo lo ve un padrino con un apadrinamiento activo.
    @Column(length = 300)
    private String beneficio;

    @Column
    private String cupon;
}
