package com.uade.tpo.SeaPlace.entity.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.uade.tpo.SeaPlace.entity.Comentario;
import com.uade.tpo.SeaPlace.entity.Usuario;

import lombok.Data;

@Data
public class ComentarioResponse {
    private Long idComentario;
    // El id del autor sirve para que el front sepa si el comentario es propio (y ofrezca borrarlo)
    private Long idUsuario;
    // Nombre y apellido del autor (un refugio se llama "Refugio <nombre>") y su rol, para mostrar quien es
    private String autor;
    private String nombreRol;
    private String texto;
    private LocalDateTime fecha;
    // Solo en los comentarios de una novedad; los de la pagina no lo traen
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long idNovedad;

    public static ComentarioResponse fromEntity(Comentario comentario) {
        ComentarioResponse r = new ComentarioResponse();
        r.setIdComentario(comentario.getIdComentario());
        Usuario autor = comentario.getUsuario();
        if (autor != null) {
            r.setIdUsuario(autor.getIdUsuario());
            r.setAutor(autor.getNombre() + " " + autor.getApellido());
            r.setNombreRol(autor.getRol().getNombreRol());
        }
        r.setTexto(comentario.getTexto());
        r.setFecha(comentario.getFecha());
        if (comentario.getNovedad() != null) {
            r.setIdNovedad(comentario.getNovedad().getIdNovedad());
        }
        return r;
    }
}
