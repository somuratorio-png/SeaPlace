package com.uade.tpo.SeaPlace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.SeaPlace.entity.Refugio;
import com.uade.tpo.SeaPlace.entity.Usuario;
import com.uade.tpo.SeaPlace.entity.dto.RefugioRequest;
import com.uade.tpo.SeaPlace.exceptions.RecursoNoEncontradoException;
import com.uade.tpo.SeaPlace.exceptions.RecursoDuplicadoException;
import com.uade.tpo.SeaPlace.repository.RefugioRepository;
import com.uade.tpo.SeaPlace.repository.UsuarioRepository;

@Service
public class RefugioServiceImpl implements RefugioService {

    @Autowired
    private RefugioRepository refugioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public List<Refugio> getRefugios() {
        return refugioRepository.findAll();
    }

    @Override
    public Optional<Refugio> getRefugioById(Long refugioId) {
        return refugioRepository.findById(refugioId);
    }

    @Override
    public Refugio createRefugio(RefugioRequest request) {
        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el usuario con id " + request.getIdUsuario()));

        // Un usuario puede administrar a lo sumo un refugio: la cuenta del refugio es la
        // identidad con la que publica sus animales.
        if (refugioRepository.findByUsuario_IdUsuario(usuario.getIdUsuario()).isPresent()) {
            throw new RecursoDuplicadoException(
                    "El usuario con id " + usuario.getIdUsuario() + " ya tiene un refugio asociado");
        }

        Refugio refugio = new Refugio();
        refugio.setUsuario(usuario);
        refugio.setNombreRefugio(request.getNombreRefugio());
        refugio.setDescripcion(request.getDescripcion());

        return refugioRepository.save(refugio);
    }
}
