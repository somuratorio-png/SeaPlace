package com.uade.tpo.SeaPlace.entity.dto;

import com.uade.tpo.SeaPlace.entity.NivelPatrocinio;
import com.uade.tpo.SeaPlace.entity.Patrocinador;

import lombok.Data;

// Lo publico de un patrocinador: lo que se muestra en "Nos acompañan" y en la pagina para patrocinar.
// El cupon no viaja aca (ver BeneficioResponse).
@Data
public class PatrocinadorResponse {
    private Long idPatrocinador;
    private String nombreEmpresa;
    private String descripcion;
    private String sitioWeb;
    private String icono;
    private String beneficio;
    // CORAL, ARRECIFE u OCEANO, y su nombre para mostrar
    private String nivel;
    private String nombreNivel;
    // Cuanto se comprometio a duplicar (la suma de los topes) y cuanto ya puso, en dolares
    private double comprometido;
    private double aportado;
    // Cuantos animales distintos acompaño con sus campañas
    private int animalesAcompaniados;

    public static PatrocinadorResponse fromEntity(Patrocinador patrocinador, double comprometido, double aportado, int animalesAcompaniados) {
        PatrocinadorResponse r = new PatrocinadorResponse();
        r.setIdPatrocinador(patrocinador.getIdPatrocinador());
        r.setNombreEmpresa(patrocinador.getNombreEmpresa());
        r.setDescripcion(patrocinador.getDescripcion());
        r.setSitioWeb(patrocinador.getSitioWeb());
        r.setIcono(patrocinador.getIcono());
        r.setBeneficio(patrocinador.getBeneficio());
        NivelPatrocinio nivel = NivelPatrocinio.segun(comprometido);
        r.setNivel(nivel.name());
        r.setNombreNivel(nivel.getNombre());
        r.setComprometido(comprometido);
        r.setAportado(aportado);
        r.setAnimalesAcompaniados(animalesAcompaniados);
        return r;
    }
}
