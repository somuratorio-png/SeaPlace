package com.uade.tpo.SeaPlace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.SeaPlace.entity.Refugio;
import com.uade.tpo.SeaPlace.entity.Usuario;
import com.uade.tpo.SeaPlace.entity.dto.RefugioRequest;
import com.uade.tpo.SeaPlace.exceptions.RecursoNoEncontradoException;
import com.uade.tpo.SeaPlace.exceptions.ReglaDeNegocioException;
import com.uade.tpo.SeaPlace.exceptions.RecursoDuplicadoException;
import com.uade.tpo.SeaPlace.repository.RefugioRepository;
import com.uade.tpo.SeaPlace.repository.UsuarioRepository;
import com.uade.tpo.SeaPlace.entity.Rol;
import com.uade.tpo.SeaPlace.repository.RolRepository;

@Service
public class RefugioServiceImpl implements RefugioService {

    @Autowired
    private RefugioRepository refugioRepository;

    @Autowired
    private NotificacionService notificacionService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AutorizacionService autorizacionService;

    @Autowired
    private RolRepository rolRepository;

    private static final int LARGO_MAXIMO = 255;
    private static final String ROL_PADRINO = "padrino";
    private static final String ROL_REFUGIO = "duenioRefugio";

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

    private boolean puedeVer(Refugio refugio) {
        if (refugio.getUsuario().isActivo() && refugio.isAprobado()) {
            return true;
        }
        Usuario actual = autorizacionService.usuarioActualONull();
        if (actual == null) {
            return false;
        }
        return autorizacionService.esAdmin()
                || actual.getIdUsuario().equals(refugio.getUsuario().getIdUsuario());
    }

    @Override
    @Transactional
    public Refugio createRefugio(RefugioRequest request) {
        return crear(request, true);
    }

    @Override
    @Transactional
    public Refugio createRefugioPendiente(RefugioRequest request) {
        return crear(request, false);
    }

    @Override
    public Refugio aprobarRefugio(Long refugioId) {
        Refugio refugio = refugioRepository.findById(refugioId)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el refugio con id " + refugioId));
        if (refugio.isAprobado()) {
            throw new ReglaDeNegocioException("El refugio ya esta aprobado");
        }
        refugio.setAprobado(true);
        Refugio aprobado = refugioRepository.save(refugio);
        if (refugio.getUsuario() != null) {
            notificacionService.notificar(refugio.getUsuario(), "¡Bienvenido a SeaPlace! Aprobamos tu refugio: ya podés publicar animales.");
        }
        return aprobado;
    }

    private Refugio crear(RefugioRequest request, boolean aprobado) {
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

        if (refugioRepository.findByUsuario_IdUsuario(usuario.getIdUsuario()).isPresent()) {
            throw new RecursoDuplicadoException(
                    "El usuario con id " + usuario.getIdUsuario() + " ya tiene un refugio asociado");
        }

        if (refugioRepository.findByNombreRefugio(nombreRefugio).isPresent()) {
            throw new RecursoDuplicadoException("Ya existe un refugio con el nombre " + nombreRefugio);
        }

        if (usuario.getRol().getNombreRol().equalsIgnoreCase(ROL_PADRINO)) {
            Rol rolRefugio = rolRepository.findByNombreRol(ROL_REFUGIO)
                    .orElseThrow(() -> new RecursoNoEncontradoException(
                            "No existe el rol '" + ROL_REFUGIO + "'"));
            usuario.setRol(rolRefugio);
            usuarioRepository.save(usuario);
        }

        Refugio refugio = new Refugio();
        refugio.setUsuario(usuario);
        refugio.setNombreRefugio(nombreRefugio);
        refugio.setDescripcion(descripcion);
        refugio.setAprobado(aprobado);

        return refugioRepository.save(refugio);
    }
}
