package com.uade.tpo.SeaPlace.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.tpo.SeaPlace.entity.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByMail(String mail);

    Optional<Usuario> findByNombreUsuario(String nombreUsuario);

    boolean existsByMail(String mail);

    boolean existsByNombreUsuario(String nombreUsuario);
}