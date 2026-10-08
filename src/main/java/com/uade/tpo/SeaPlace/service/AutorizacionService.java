package com.uade.tpo.SeaPlace.service;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.uade.tpo.SeaPlace.entity.Refugio;
import com.uade.tpo.SeaPlace.entity.Usuario;
import com.uade.tpo.SeaPlace.entity.Animal;

// Centraliza las reglas de "quien puede tocar que": la usan varios services
// (Animal, FotoAnimal, Descuento, UbicacionAnimal, Muelle, Zarpar) para no repetir
// la misma logica de admin-vs-dueno en cada uno.
@Component
public class AutorizacionService {

    private static final String ROL_ADMINISTRADOR = "administrador";
    private static final String ROL_REFUGIO = "duenioRefugio";

    public Usuario usuarioActual() {
        return (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
    
    // Id del usuario logueado (el del token).
    public Long idUsuarioActual() {
        return usuarioActual().getIdUsuario();
    }

    // Devuelve el usuario logueado, o null si la request no trae token (rutas publicas).
    public Usuario usuarioActualONull() {
        var autenticacion = SecurityContextHolder.getContext().getAuthentication();
        if (autenticacion != null && autenticacion.getPrincipal() instanceof Usuario usuario) {
            return usuario;
        }
        return null;
    }

    public boolean esAdmin() {
        return usuarioActual().getRol().getNombreRol().equalsIgnoreCase(ROL_ADMINISTRADOR);
    }

    // Una publicacion ACTIVA la ve cualquiera. Una no activa solo la ve un admin o,
    // si esta PAUSADA, el dueño de su refugio.
    public boolean puedeVerAnimal(Animal animal) {
        if ("ACTIVA".equals(animal.getEstado())) {
            return true;
        }
        Usuario actual = usuarioActualONull();
        if (actual == null) {
            return false;
        }
        if (esAdmin()) {
            return true;
        }
        return "PAUSADA".equals(animal.getEstado())
                && actual.getRefugio() != null
                && actual.getRefugio().getIdRefugio().equals(animal.getRefugio().getIdRefugio());
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

    // Una cuenta de refugio administra animales, no los apadrina.
    public void validarPuedeApadrinar(Usuario usuario) {
        if (usuario.getRol().getNombreRol().equalsIgnoreCase(ROL_REFUGIO)) {
            throw new AccessDeniedException("Una cuenta de refugio no puede apadrinar animales");
        }
    }
}
