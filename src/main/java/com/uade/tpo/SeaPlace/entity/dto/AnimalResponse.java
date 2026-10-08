package com.uade.tpo.SeaPlace.entity.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import com.uade.tpo.SeaPlace.entity.Animal;
import com.uade.tpo.SeaPlace.entity.Descuento;
import com.uade.tpo.SeaPlace.entity.FotoAnimal;

import lombok.Data;

@Data
public class AnimalResponse {
    private Long idAnimal;
    private String nombreAnimal;
    private String descripcion;
    private Double cuotaApadrinamiento;
    private Integer cuposTotales;
    private Integer cuposDisponibles;
    private String estado;
    private LocalDateTime fechaPublicacion;
    private Long idCategoria;
    private String nombreCategoria;
    private Long idRefugio;
    private String nombreRefugio;
    private String especie;
    private String edad;
    private String ubicacion;
    private String urgencia;
    private String condicion;
    private boolean destacado;
    // Porcentaje de cupos ya tomados por padrinos (0 a 100).
    private Integer progreso;
    // Urls de las fotos, ya ordenadas: la primera es la principal.
    private List<String> fotos;
    // El descuento que rige hoy (el mayor, si hay varios), o null si no esta en oferta.
    private DescuentoResponse descuento;

    public static AnimalResponse fromEntity(Animal animal) {
        AnimalResponse r = new AnimalResponse();
        r.setIdAnimal(animal.getIdAnimal());
        r.setNombreAnimal(animal.getNombreAnimal());
        r.setDescripcion(animal.getDescripcion());
        r.setCuotaApadrinamiento(animal.getCuotaApadrinamiento());
        r.setCuposTotales(animal.getCuposTotales());
        r.setCuposDisponibles(animal.getCuposDisponibles());
        r.setEstado(animal.getEstado());
        r.setFechaPublicacion(animal.getFechaPublicacion());
        if (animal.getCategoria() != null) {
            r.setIdCategoria(animal.getCategoria().getIdCategoria());
            r.setNombreCategoria(animal.getCategoria().getNombreCategoria());
        }
        if (animal.getRefugio() != null) {
            r.setIdRefugio(animal.getRefugio().getIdRefugio());
            r.setNombreRefugio(animal.getRefugio().getNombreRefugio());
        }
        r.setEspecie(animal.getEspecie());
        r.setEdad(animal.getEdad());
        r.setUbicacion(animal.getUbicacion());
        r.setUrgencia(animal.getUrgencia());
        r.setCondicion(animal.getCondicion());
        r.setDestacado(animal.isDestacado());
        r.setProgreso(calcularProgreso(animal));
        r.setFotos(urlsDeFotos(animal));
        r.setDescuento(descuentoVigente(animal));
        return r;
    }

    private static Integer calcularProgreso(Animal animal) {
        if (animal.getCuposTotales() == null || animal.getCuposTotales() <= 0 || animal.getCuposDisponibles() == null) {
            return 0;
        }
        int ocupados = animal.getCuposTotales() - animal.getCuposDisponibles();
        return (int) Math.round(ocupados * 100.0 / animal.getCuposTotales());
    }

    private static List<String> urlsDeFotos(Animal animal) {
        // Un animal recien creado todavia no tiene la lista cargada.
        if (animal.getFotos() == null) {
            return new ArrayList<>();
        }
        return animal.getFotos().stream()
                .sorted(Comparator.comparing(FotoAnimal::getOrden, Comparator.nullsLast(Comparator.naturalOrder())))
                .map(FotoAnimal::getUrlImagen)
                .toList();
    }

    // Misma regla que usa el zarpar para cobrar: de los descuentos activos cuya vigencia
    // incluye el dia de hoy, se aplica el de mayor porcentaje.
    private static DescuentoResponse descuentoVigente(Animal animal) {
        if (animal.getDescuentos() == null) {
            return null;
        }
        LocalDate hoy = LocalDate.now();
        return animal.getDescuentos().stream()
                .filter(d -> Boolean.TRUE.equals(d.getActivo()))
                .filter(d -> !hoy.isBefore(d.getFechaInicio()) && !hoy.isAfter(d.getFechaFin()))
                .max(Comparator.comparing(Descuento::getPorcentaje))
                .map(DescuentoResponse::fromEntity)
                .orElse(null);
    }
}
