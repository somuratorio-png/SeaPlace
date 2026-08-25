package com.uade.tpo.SeaPlace.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import com.uade.tpo.SeaPlace.entity.Usuario;
import com.uade.tpo.SeaPlace.entity.dto.UsuarioRequest;

public interface UsuarioService {
    Page<Usuario> getUsuarios(PageRequest pageRequest);

    Optional<Usuario> getUsuarioById(Long usuarioId);

    Usuario createUsuario(UsuarioRequest request);
}