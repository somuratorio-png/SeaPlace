package com.uade.tpo.SeaPlace.entity.dto;

import com.uade.tpo.SeaPlace.entity.Categoria;

import lombok.Data;

@Data
public class CategoriaResponse {
    private Long idCategoria;
    private String nombreCategoria;
    private String descripcion;

    public static CategoriaResponse fromEntity(Categoria categoria) {
        CategoriaResponse r = new CategoriaResponse();
        r.setIdCategoria(categoria.getIdCategoria());
        r.setNombreCategoria(categoria.getNombreCategoria());
        r.setDescripcion(categoria.getDescripcion());
        return r;
    }
}
