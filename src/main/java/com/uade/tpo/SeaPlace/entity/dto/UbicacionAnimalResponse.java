package com.uade.tpo.SeaPlace.entity.dto;

import java.time.LocalDateTime;

import com.uade.tpo.SeaPlace.entity.UbicacionAnimal;

import lombok.Data;

@Data
public class UbicacionAnimalResponse {
    private Long idUbicacion;
    private Long idAnimal;
    private Double latitud;
    private Double longitud;
    private LocalDateTime fechaHora;

    public static UbicacionAnimalResponse fromEntity(UbicacionAnimal ubicacion) {
        UbicacionAnimalResponse r = new UbicacionAnimalResponse();
        r.setIdUbicacion(ubicacion.getIdUbicacion());
        if (ubicacion.getAnimal() != null) {
            r.setIdAnimal(ubicacion.getAnimal().getIdAnimal());
        }
        r.setLatitud(ubicacion.getLatitud());
        r.setLongitud(ubicacion.getLongitud());
        r.setFechaHora(ubicacion.getFechaHora());
        return r;
    }
}
