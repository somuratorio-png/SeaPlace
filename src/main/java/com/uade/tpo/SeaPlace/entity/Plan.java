package com.uade.tpo.SeaPlace.entity;

import com.uade.tpo.SeaPlace.exceptions.ReglaDeNegocioException;

// Los tres niveles de apadrinamiento. No son una tabla: son fijos y viven en el codigo.
// El precio de cada uno sale de la cuota del animal multiplicada por "multiplicador".
public enum Plan {
    BRISA_MARINA("Brisa Marina", 0.5,
            "Certificado digital y bitácora mensual por correo.", false),
    GUARDIAN_DE_LA_BAHIA("Guardián de la Bahía", 1.0,
            "Todo lo anterior + webcam 24/7 y kit de bienvenida.", false),
    MAREA_PROFUNDA("Marea Profunda", 2.0,
            "Todo lo anterior + ubicación en vivo y charla virtual con los biólogos.", true);

    // El que se usa cuando el pedido no indica plan.
    public static final Plan POR_DEFECTO = GUARDIAN_DE_LA_BAHIA;

    private final String nombre;
    private final double multiplicador;
    private final String descripcion;
    private final boolean ubicacionEnVivo;

    Plan(String nombre, double multiplicador, String descripcion, boolean ubicacionEnVivo) {
        this.nombre = nombre;
        this.multiplicador = multiplicador;
        this.descripcion = descripcion;
        this.ubicacionEnVivo = ubicacionEnVivo;
    }

    public String getNombre() {
        return nombre;
    }

    public double getMultiplicador() {
        return multiplicador;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public boolean isUbicacionEnVivo() {
        return ubicacionEnVivo;
    }

    // Convierte el codigo que manda el cliente (ej: "MAREA_PROFUNDA") en el plan.
    // Sin codigo, se usa el plan por defecto.
    public static Plan desde(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            return POR_DEFECTO;
        }
        try {
            return Plan.valueOf(codigo.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new ReglaDeNegocioException(
                    "Plan invalido: BRISA_MARINA, GUARDIAN_DE_LA_BAHIA o MAREA_PROFUNDA");
        }
    }

    // Lo que cuesta por mes un cupo con este plan, a partir de la cuota del animal
    // (ya con el descuento aplicado, si tiene uno vigente).
    public double precioPara(double cuota) {
        return Math.round(cuota * multiplicador * 100.0) / 100.0;
    }
}
