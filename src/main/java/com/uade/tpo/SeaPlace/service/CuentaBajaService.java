package com.uade.tpo.SeaPlace.service;

import org.springframework.stereotype.Service;

import com.uade.tpo.SeaPlace.entity.Usuario;
import com.uade.tpo.SeaPlace.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CuentaBajaService {

    private final UsuarioRepository usuarioRepository;

    // Si el mail o el nombre de usuario pertenecen a una cuenta de baja cuyo plazo ya vencio,
    // se los libera para que se puedan volver a usar. La fila no se borra (conserva sus
    // zarpar): solo se le cambian el mail y el nombre de usuario por valores sin sentido.
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