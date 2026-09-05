package com.uade.tpo.SeaPlace.service;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.uade.tpo.SeaPlace.entity.Refugio;
import com.uade.tpo.SeaPlace.entity.Usuario;

// Centraliza las reglas de "quien puede tocar que": la usan varios services
// (Animal, FotoAnimal, Descuento, UbicacionAnimal, Carrito, Compra) para no repetir
// la misma logica de admin-vs-dueno en cada uno.
@Component
public class AutorizacionService {

    private static final String ROL_ADMINISTRADOR = "administrador";

    public Usuario usuarioActual() {
        return (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public boolean esAdmin() {
        return usuarioActual().getRol().getNombreRol().equalsIgnoreCase(ROL_ADMINISTRADOR);
    }

    // Un ADMINISTRADOR puede gestionar cualquier animal. Un refugio (no admin) solo puede
    // gestionar los animales de su propio refugio, segun el vinculo 1 a 1 Usuario-Refugio.
    // La usan AnimalServiceImpl, FotoAnimalServiceImpl, DescuentoServiceImpl y
    // UbicacionAnimalServiceImpl: todo lo que cuelga de un Animal respeta la misma regla.
    public void validarPermisoSobreRefugio(Long idRefugio) {
        if (esAdmin()) {
            return;
        }

        Refugio refugioPropio = usuarioActual().getRefugio();
        if (refugioPropio == null || !refugioPropio.getIdRefugio().equals(idRefugio)) {
            throw new AccessDeniedException("No tenes permiso para gestionar animales de este refugio");
        }
    }

    // Un ADMINISTRADOR puede ver u operar el carrito o las compras de cualquier usuario.
    // Un usuario comun solo puede ver u operar los suyos.
    public void validarPropietarioOAdmin(Long idUsuarioDueño) {
        if (esAdmin()) {
            return;
        }

        if (!usuarioActual().getIdUsuario().equals(idUsuarioDueño)) {
            throw new AccessDeniedException("No tenes permiso para acceder a este recurso");
        }
    }
}
