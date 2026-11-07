package com.uade.tpo.SeaPlace.entity;

// De que se trata una notificacion, para que el front las agrupe:
// - PUBLICACIONES: al refugio, sobre sus publicaciones y su cuenta (aprobaciones, rechazos, bajas).
// - COMENTARIOS: al refugio, cuando un padrino comenta una novedad.
// - PATROCINIOS: al refugio y al patrocinador, sobre las campañas de duplicacion (propuestas, aceptadas, rechazadas).
// - NOVEDADES: a los padrinos, cuando el refugio publica una novedad de su apadrinado.
// - APADRINADOS: a los padrinos, cuando su apadrinado se pausa, vuelve al catalogo o se da de baja.
// - GENERAL: lo que no entra en ninguno (y las notificaciones anteriores a los temas).
public enum TemaNotificacion {
    PUBLICACIONES,
    COMENTARIOS,
    PATROCINIOS,
    NOVEDADES,
    APADRINADOS,
    GENERAL
}
