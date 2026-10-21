package com.uade.tpo.SeaPlace.service;

import org.springframework.stereotype.Service;

import com.uade.tpo.SeaPlace.entity.Usuario;
import com.uade.tpo.SeaPlace.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CuentaBajaService {

    private final UsuarioRepository usuarioRepository;

    public void liberarSiVencida(String mail, String nombreUsuario) {
        usuarioRepository.findByMail(mail).ifPresent(this::liberar);
        usuarioRepository.findByNombreUsuario(nombreUsuario).ifPresent(this::liberar);
    }

    private void liberar(Usuario usuario) {
        if (!usuario.bajaVencida()) {
            return;
        }
        usuario.setMail("eliminado-" + usuario.getIdUsuario() + "@seaplace.invalid");
        usuario.setNombreUsuario("eliminado-" + usuario.getIdUsuario());
        usuarioRepository.save(usuario);
    }
}