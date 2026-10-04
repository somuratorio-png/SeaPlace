package com.uade.tpo.SeaPlace.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import com.uade.tpo.SeaPlace.entity.Usuario;
import com.uade.tpo.SeaPlace.entity.dto.UsuarioRequest;
import com.uade.tpo.SeaPlace.entity.dto.UsuarioPerfilRequest;
import com.uade.tpo.SeaPlace.entity.dto.CambiarContraseniaRequest;

public interface UsuarioService {
    Page<Usuario> getUsuarios(PageRequest pageRequest);

    Optional<Usuario> getUsuarioById(Long usuarioId);

    Usuario createUsuario(UsuarioRequest request);

    Usuario cambiarRol(Long usuarioId, Long idRol);

    Usuario darDeBaja(Long usuarioId);

    Usuario modificarMiPerfil(UsuarioPerfilRequest request);

    Usuario getMiPerfil();

    void cambiarMiContrasenia(CambiarContraseniaRequest request);
}