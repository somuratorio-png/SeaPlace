package com.uade.tpo.SeaPlace.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.SeaPlace.entity.Rol;
import com.uade.tpo.SeaPlace.entity.Usuario;
import com.uade.tpo.SeaPlace.entity.dto.UsuarioRequest;
import com.uade.tpo.SeaPlace.exceptions.RecursoDuplicadoException;
import com.uade.tpo.SeaPlace.exceptions.RecursoNoEncontradoException;
import com.uade.tpo.SeaPlace.repository.RolRepository;
import com.uade.tpo.SeaPlace.repository.UsuarioRepository;
import com.uade.tpo.SeaPlace.exceptions.ReglaDeNegocioException;
import com.uade.tpo.SeaPlace.entity.Animal;
import com.uade.tpo.SeaPlace.repository.AnimalRepository;
import com.uade.tpo.SeaPlace.entity.dto.UsuarioPerfilRequest;
import com.uade.tpo.SeaPlace.entity.dto.CambiarContraseniaRequest;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private static final String ROL_ADMINISTRADOR = "administrador";
    private static final String ESTADO_PUBLICACION_ACTIVA = "ACTIVA";
    private static final String ESTADO_PUBLICACION_PAUSADA = "PAUSADA"; 

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AutorizacionService autorizacionService;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private CuentaBajaService cuentaBajaService;

    @Override
    public Page<Usuario> getUsuarios(PageRequest pageRequest) {
        return usuarioRepository.findAll(pageRequest);
    }

    @Override
    public Optional<Usuario> getUsuarioById(Long usuarioId) {
        return usuarioRepository.findById(usuarioId);
    }

    @Override
    public Usuario createUsuario(UsuarioRequest request) {
        if (!autorizacionService.esAdmin()) {
            throw new AccessDeniedException("No tenes permiso para crear usuarios");
        }

        if (request.getIdRol() == null) {
            throw new ReglaDeNegocioException("El campo 'idRol' es obligatorio");
        }

        String nombre = ValidadorUsuarioService.textoObligatorio(request.getNombre(), "nombre");
        String apellido = ValidadorUsuarioService.textoObligatorio(request.getApellido(), "apellido");
        String mail = ValidadorUsuarioService.mailValido(request.getMail());
        String nombreUsuario = ValidadorUsuarioService.nombreUsuarioValido(request.getNombreUsuario());
        ValidadorUsuarioService.validarContrasenia(request.getContrasenia());

        Rol rol = rolRepository.findById(request.getIdRol())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el rol con id " + request.getIdRol()));
        
        cuentaBajaService.liberarSiVencida(mail, nombreUsuario);
        
        if (usuarioRepository.existsByMail(mail)) {
            throw new RecursoDuplicadoException("Ya existe un usuario con el mail " + mail);
        }
        if (usuarioRepository.existsByNombreUsuario(nombreUsuario)) {
            throw new RecursoDuplicadoException(
                    "Ya existe un usuario con el nombre de usuario " + nombreUsuario);
        }

        Usuario usuario = new Usuario();
        usuario.setRol(rol);
        usuario.setNombre(nombre);
        usuario.setApellido(apellido);
        usuario.setMail(mail);
        usuario.setNombreUsuario(nombreUsuario);
        usuario.setContrasenia(passwordEncoder.encode(request.getContrasenia()));
        usuario.setFechaRegistro(LocalDateTime.now());

        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario cambiarRol(Long usuarioId, Long idRol) {
        if (idRol == null) {
            throw new ReglaDeNegocioException("El campo 'idRol' es obligatorio");
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el usuario con id " + usuarioId));

        Rol rol = rolRepository.findById(idRol)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el rol con id " + idRol));

        // Si el usuario es administrador y el rol nuevo no lo es, tiene que quedar
        // al menos otro administrador: si no, nadie podria volver a gestionar roles.
        boolean eraAdmin = usuario.getRol().getNombreRol().equalsIgnoreCase(ROL_ADMINISTRADOR);
        boolean seguiraSiendoAdmin = rol.getNombreRol().equalsIgnoreCase(ROL_ADMINISTRADOR);
        if (eraAdmin && !seguiraSiendoAdmin
                && usuarioRepository.countByRol_NombreRol(ROL_ADMINISTRADOR) <= 1) {
            throw new ReglaDeNegocioException("No se puede quitar el rol al ultimo administrador");
        }

        usuario.setRol(rol);
        return usuarioRepository.save(usuario);
    }

    @Override
    @Transactional
    public Usuario darDeBaja(Long usuarioId) {
        // Solo el propio usuario (o un admin) puede darlo de baja.
        autorizacionService.validarPropietarioOAdmin(usuarioId);

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el usuario con id " + usuarioId));

        if (usuario.getRol().getNombreRol().equalsIgnoreCase(ROL_ADMINISTRADOR)) {
            throw new ReglaDeNegocioException("No se puede dar de baja a un administrador");
        }
        if (!usuario.isActivo()) {
            throw new ReglaDeNegocioException("El usuario ya esta dado de baja");
        }

        usuario.setFechaBaja(LocalDateTime.now());
        usuario.setActivo(false);
        pausarPublicaciones(usuario);
        return usuarioRepository.save(usuario);
    }

    // Si el usuario administraba un refugio, sus publicaciones activas se pausan
    // para que dejen de verse en el catalogo.
    private void pausarPublicaciones(Usuario usuario) {
        if (usuario.getRefugio() == null) {
            return;
        }

        List<Animal> animales = animalRepository.findByRefugio_IdRefugio(usuario.getRefugio().getIdRefugio());
        for (Animal animal : animales) {
            if (ESTADO_PUBLICACION_ACTIVA.equals(animal.getEstado())) {
                animal.setEstado(ESTADO_PUBLICACION_PAUSADA);
            }
        }
        animalRepository.saveAll(animales);
    }

    @Override
    public Usuario modificarMiPerfil(UsuarioPerfilRequest request) {
        Long idUsuario = autorizacionService.idUsuarioActual();
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el usuario con id " + idUsuario));

        // Solo se cambia lo que viene en el pedido. El nombre de usuario (que es el que lleva
        // el token), el rol y el estado de la cuenta no se pueden modificar desde aca.
        if (request.getNombre() != null) {
            usuario.setNombre(ValidadorUsuarioService.textoObligatorio(request.getNombre(), "nombre"));
        }
        if (request.getApellido() != null) {
            usuario.setApellido(ValidadorUsuarioService.textoObligatorio(request.getApellido(), "apellido"));
        }
        if (request.getMail() != null) {
            String mail = ValidadorUsuarioService.mailValido(request.getMail());
            if (!mail.equalsIgnoreCase(usuario.getMail())) {
                // Si el mail era de una cuenta de baja con el plazo vencido, se libera.
                // (El nombre de usuario que se pasa es el propio: al estar activo, no se toca.)
                cuentaBajaService.liberarSiVencida(mail, usuario.getNombreUsuario());
                if (usuarioRepository.existsByMail(mail)) {
                    throw new RecursoDuplicadoException("Ya existe un usuario con el mail " + mail);
                }
                usuario.setMail(mail);
            }
        }

        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario getMiPerfil() {
        Long idUsuario = autorizacionService.idUsuarioActual();
        return usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el usuario con id " + idUsuario));
    }

    @Override
    public void cambiarMiContrasenia(CambiarContraseniaRequest request) {
        Long idUsuario = autorizacionService.idUsuarioActual();
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el usuario con id " + idUsuario));

        // Hay que conocer la contrasenia actual: asi nadie con la sesion abierta puede cambiarla.
        if (request.getContraseniaActual() == null
                || !passwordEncoder.matches(request.getContraseniaActual(), usuario.getContrasenia())) {
            throw new ReglaDeNegocioException("La contrasenia actual es incorrecta");
        }

        ValidadorUsuarioService.validarContrasenia(request.getContraseniaNueva());
        if (request.getContraseniaNueva().equals(request.getContraseniaActual())) {
            throw new ReglaDeNegocioException("La contrasenia nueva tiene que ser distinta de la actual");
        }

        usuario.setContrasenia(passwordEncoder.encode(request.getContraseniaNueva()));
        usuarioRepository.save(usuario);
    }
}