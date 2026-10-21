package com.uade.tpo.SeaPlace.entity.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.uade.tpo.SeaPlace.entity.Apadrinamiento;
import com.uade.tpo.SeaPlace.entity.ZarparDetalle;

import lombok.Data;

@Data
public class ApadrinamientoResponse {
    private Long idApadrinamiento;
    private Long idUsuario;
    private String nombreUsuario;
    private String nombrePadrino;
    private AnimalResponse animal;
    private String plan;
    private Integer cupos;
    private LocalDateTime fechaInicio;
    private boolean activo;
    private LocalDateTime fechaCancelacion;
    private List<PagoResponse> pagos;
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private List<NovedadResponse> novedades;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private UbicacionAnimalResponse ultimaUbicacion;

    public static ApadrinamientoResponse fromEntity(Apadrinamiento apadrinamiento, List<ZarparDetalle> pagos) {
        ApadrinamientoResponse r = new ApadrinamientoResponse();
        r.setIdApadrinamiento(apadrinamiento.getIdApadrinamiento());
        if (apadrinamiento.getUsuario() != null) {
            r.setIdUsuario(apadrinamiento.getUsuario().getIdUsuario());
            r.setNombreUsuario(apadrinamiento.getUsuario().getNombreUsuario());
            r.setNombrePadrino(apadrinamiento.getUsuario().getNombre() + " " + apadrinamiento.getUsuario().getApellido());
        }
        if (apadrinamiento.getAnimal() != null) {
            r.setAnimal(AnimalResponse.fromEntity(apadrinamiento.getAnimal()));
        }
        r.setPlan(apadrinamiento.getPlan().name());
        r.setCupos(apadrinamiento.getCupos());
        r.setFechaInicio(apadrinamiento.getFechaInicio());
        r.setActivo(apadrinamiento.isActivo());
        r.setFechaCancelacion(apadrinamiento.getFechaCancelacion());
        r.setPagos(pagos.stream().map(PagoResponse::fromEntity).toList());
        return r;
    }
}
