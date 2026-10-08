package com.uade.tpo.SeaPlace.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

// El contenido de una foto subida como archivo. Va en una tabla aparte de FotoAnimal
// para que listar las fotos de un animal no traiga los bytes de todas las imagenes:
// solo se leen cuando alguien pide el archivo.
@Data
@Entity
@Table(name = "archivo_foto")
public class ArchivoFoto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idArchivo;

    @OneToOne
    @JoinColumn(name = "id_foto", nullable = false, unique = true)
    private FotoAnimal foto;

    @Lob
    @Column(nullable = false, columnDefinition = "LONGBLOB")
    private byte[] contenido;

    // Tipo del archivo, por ejemplo "image/jpeg": se devuelve tal cual al servirlo.
    @Column(nullable = false)
    private String tipoContenido;
}
