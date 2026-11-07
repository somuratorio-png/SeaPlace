package com.uade.tpo.SeaPlace.entity;

// Los niveles de un patrocinador. No se guardan: salen de cuanto se comprometio a duplicar
// (la suma de los topes de todas sus campañas, en dolares). Cuanto mas alto, mas visible en el sitio.
public enum NivelPatrocinio {
    CORAL("Coral", 0),
    ARRECIFE("Arrecife", 300),
    OCEANO("Océano", 1000);

    private final String nombre;
    // Desde cuanto comprometido (en dolares) se llega a este nivel
    private final double desde;

    NivelPatrocinio(String nombre, double desde) {
        this.nombre = nombre;
        this.desde = desde;
    }

    public String getNombre() {
        return nombre;
    }

    public double getDesde() {
        return desde;
    }

    public static NivelPatrocinio segun(double comprometido) {
        if (comprometido >= OCEANO.desde) {
            return OCEANO;
        }
        if (comprometido >= ARRECIFE.desde) {
            return ARRECIFE;
        }
        return CORAL;
    }
}
