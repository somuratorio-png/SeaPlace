package com.uade.tpo.SeaPlace.service;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.uade.tpo.SeaPlace.entity.Refugio;
import com.uade.tpo.SeaPlace.entity.Usuario;
import com.uade.tpo.SeaPlace.entity.Animal;

@Component
public class AutorizacionService {

    private static final String ROL_ADMINISTRADOR = "administrador";
    private static final String ROL_REFUGIO = "duenioRefugio";

    public Usuario usuarioActual() {
        return (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
    
    public Long idUsuarioActual() {
        return usuarioActual().getIdUsuario();
    }

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
        return ("PAUSADA".equals(animal.getEstado()) || "PENDIENTE".equals(animal.getEstado()))
                && actual.getRefugio() != null
                && actual.getRefugio().getIdRefugio().equals(animal.getRefugio().getIdRefugio());
    }

    public void validarPermisoSobreRefugio(Long idRefugio) {
        if (esAdmin()) {
            return;
        }

        Refugio refugioPropio = usuarioActual().getRefugio();
        if (refugioPropio == null || !refugioPropio.getIdRefugio().equals(idRefugio)) {
            throw new AccessDeniedException("No tenes permiso para gestionar animales de este refugio");
        }
    }

    public void validarPropietarioOAdmin(Long idUsuarioDueño) {
        if (esAdmin()) {
            return;
        }

        if (!usuarioActual().getIdUsuario().equals(idUsuarioDueño)) {
            throw new AccessDeniedException("No tenes permiso para acceder a este recurso");
        }
    }

    public void validarPuedeApadrinar(Usuario usuario) {
        if (usuario.getRol().getNombreRol().equalsIgnoreCase(ROL_REFUGIO)) {
            throw new AccessDeniedException("Una cuenta de refugio no puede apadrinar animales");
        }
    }
}
