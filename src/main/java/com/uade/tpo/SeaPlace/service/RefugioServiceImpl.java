package com.uade.tpo.SeaPlace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.SeaPlace.entity.Refugio;
import com.uade.tpo.SeaPlace.entity.Usuario;
import com.uade.tpo.SeaPlace.entity.dto.RefugioRequest;
import com.uade.tpo.SeaPlace.exceptions.RecursoNoEncontradoException;
import com.uade.tpo.SeaPlace.exceptions.ReglaDeNegocioException;
import com.uade.tpo.SeaPlace.exceptions.RecursoDuplicadoException;
import com.uade.tpo.SeaPlace.repository.RefugioRepository;
import com.uade.tpo.SeaPlace.repository.UsuarioRepository;

@Service
public class RefugioServiceImpl implements RefugioService {

    @Autowired
    private RefugioRepository refugioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AutorizacionService autorizacionService;

    private static final int LARGO_MAXIMO = 255;

    @Override
    public List<Refugio> getRefugios() {
        return refugioRepository.findAll().stream()
                .filter(this::puedeVer)
                .toList();
    }

    @Override
    public Optional<Refugio> getRefugioById(Long refugioId) {
        return refugioRepository.findById(refugioId).filter(this::puedeVer);
    }

    // Un refugio cuyo usuario esta dado de baja solo lo ve un admin;
    // para el resto es como si no existiera (404 en el detalle).
    private boolean puedeVer(Refugio refugio) {
        if (refugio.getUsuario().isActivo()) {
            return true;
        }
        return autorizacionService.usuarioActualONull() != null && autorizacionService.esAdmin();
    }

    @Override
    public Refugio createRefugio(RefugioRequest request) {
        if (request.getIdUsuario() == null) {
            throw new ReglaDeNegocioException("Debe indicar el usuario que administra el refugio");
        }

        String nombreRefugio = request.getNombreRefugio() == null ? "" : request.getNombreRefugio().trim();
        if (nombreRefugio.isEmpty()) {
            throw new ReglaDeNegocioException("El nombre del refugio es obligatorio");
        }
        if (nombreRefugio.length() > LARGO_MAXIMO) {
            throw new ReglaDeNegocioException(
                    "El nombre del refugio no puede superar los " + LARGO_MAXIMO + " caracteres");
        }

        String descripcion = request.getDescripcion() == null ? null : request.getDescripcion().trim();
        if (descripcion != null && descripcion.length() > LARGO_MAXIMO) {
            throw new ReglaDeNegocioException(
                    "La descripcion no puede superar los " + LARGO_MAXIMO + " caracteres");
        }

        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el usuario con id " + request.getIdUsuario()));

        // Un usuario puede administrar a lo sumo un refugio: la cuenta del refugio es la
        // identidad con la que publica sus animales.
        if (refugioRepository.findByUsuario_IdUsuario(usuario.getIdUsuario()).isPresent()) {
            throw new RecursoDuplicadoException(
                    "El usuario con id " + usuario.getIdUsuario() + " ya tiene un refugio asociado");
        }

        // Dos refugios con el mismo nombre se confundirian en el catalogo.
        if (refugioRepository.findByNombreRefugio(nombreRefugio).isPresent()) {
            throw new RecursoDuplicadoException("Ya existe un refugio con el nombre " + nombreRefugio);
        }

        Refugio refugio = new Refugio();
        refugio.setUsuario(usuario);
        refugio.setNombreRefugio(nombreRefugio);
        refugio.setDescripcion(descripcion);

        return refugioRepository.save(refugio);
    }
}
