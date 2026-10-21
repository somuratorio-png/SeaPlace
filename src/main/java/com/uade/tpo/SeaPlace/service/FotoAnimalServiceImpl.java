package com.uade.tpo.SeaPlace.service;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.uade.tpo.SeaPlace.entity.Animal;
import com.uade.tpo.SeaPlace.entity.ArchivoFoto;
import com.uade.tpo.SeaPlace.repository.ArchivoFotoRepository;
import com.uade.tpo.SeaPlace.entity.FotoAnimal;
import com.uade.tpo.SeaPlace.entity.dto.FotoAnimalRequest;
import com.uade.tpo.SeaPlace.exceptions.RecursoNoEncontradoException;
import com.uade.tpo.SeaPlace.exceptions.ReglaDeNegocioException;
import com.uade.tpo.SeaPlace.repository.AnimalRepository;
import com.uade.tpo.SeaPlace.repository.FotoAnimalRepository;
import java.util.Objects;
import com.uade.tpo.SeaPlace.exceptions.RecursoDuplicadoException;

@Service
public class FotoAnimalServiceImpl implements FotoAnimalService {

    private static final int LARGO_MAXIMO_URL = 255;

    private static final List<String> TIPOS_DE_IMAGEN = List.of("image/jpeg", "image/png", "image/webp", "image/gif");
    private static final int LADO_MAXIMO = 800;
    private static final float CALIDAD_JPEG = 0.8f;

    @Autowired
    private ArchivoFotoRepository archivoFotoRepository;

    @Autowired
    private FotoAnimalRepository fotoAnimalRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private AutorizacionService autorizacionService;

    @Override
    public List<FotoAnimal> getFotosByAnimal(Long animalId) {
        animalRepository.findById(animalId)
            .filter(autorizacionService::puedeVerAnimal)
            .orElseThrow(() -> new RecursoNoEncontradoException("No existe el animal con id " + animalId));
        return fotoAnimalRepository.findByAnimal_IdAnimalOrderByOrdenAsc(animalId);
    }

    @Override
    public FotoAnimal createFoto(FotoAnimalRequest request) {
        if (request.getIdAnimal() == null) {
            throw new ReglaDeNegocioException("Debe indicar el animal al que pertenece la foto");
        }

        Animal animal = animalRepository.findById(request.getIdAnimal())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el animal con id " + request.getIdAnimal()));

        autorizacionService.validarPermisoSobreRefugio(animal.getRefugio().getIdRefugio());

        String urlImagen = request.getUrlImagen() == null ? "" : request.getUrlImagen().trim();
        if (urlImagen.isEmpty()) {
            throw new ReglaDeNegocioException("La url de la imagen es obligatoria");
        }
        if (urlImagen.length() > LARGO_MAXIMO_URL) {
            throw new ReglaDeNegocioException(
                    "La url de la imagen no puede superar los " + LARGO_MAXIMO_URL + " caracteres");
        }

        String urlMinuscula = urlImagen.toLowerCase();
        boolean formatoValido = (urlMinuscula.startsWith("http://")
                || urlMinuscula.startsWith("https://")
                || urlImagen.startsWith("/"))
                && urlImagen.chars().noneMatch(Character::isWhitespace);
        if (!formatoValido) {
            throw new ReglaDeNegocioException(
                    "La url de la imagen debe empezar con http://, https:// o / y no tener espacios");
        }

        List<FotoAnimal> fotosActuales = fotoAnimalRepository
                .findByAnimal_IdAnimalOrderByOrdenAsc(animal.getIdAnimal());

        Integer orden = request.getOrden();
        if (orden == null) {
            orden = fotosActuales.stream()
                    .map(FotoAnimal::getOrden)
                    .filter(Objects::nonNull)
                    .mapToInt(Integer::intValue)
                    .max()
                    .orElse(0) + 1;
        } else {
            if (orden < 1) {
                throw new ReglaDeNegocioException("El orden de la foto debe ser mayor a 0");
            }
            for (FotoAnimal fotoExistente : fotosActuales) {
                if (orden.equals(fotoExistente.getOrden())) {
                    throw new RecursoDuplicadoException(
                            "El animal ya tiene una foto en la posicion " + orden);
                }
            }
        }

        FotoAnimal foto = new FotoAnimal();
        foto.setAnimal(animal);
        foto.setUrlImagen(urlImagen);
        foto.setOrden(orden);

        return fotoAnimalRepository.save(foto);
    }

    @Override
    @Transactional
    public FotoAnimal subirFoto(Long animalId, MultipartFile archivo) {
        Animal animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el animal con id " + animalId));

        autorizacionService.validarPermisoSobreRefugio(animal.getRefugio().getIdRefugio());

        if (archivo == null || archivo.isEmpty()) {
            throw new ReglaDeNegocioException("El archivo de la foto es obligatorio");
        }
        String tipoContenido = archivo.getContentType() == null ? "" : archivo.getContentType().toLowerCase();
        if (!TIPOS_DE_IMAGEN.contains(tipoContenido)) {
            throw new ReglaDeNegocioException("El archivo debe ser una imagen JPG, PNG, WEBP o GIF");
        }
        byte[] original;
        try {
            original = archivo.getBytes();
        } catch (IOException ex) {
            throw new ReglaDeNegocioException("No se pudo leer el archivo de la foto");
        }
        byte[] contenido = achicarAJpeg(original);

        int orden = fotoAnimalRepository.findByAnimal_IdAnimalOrderByOrdenAsc(animalId).stream()
                .map(FotoAnimal::getOrden)
                .filter(Objects::nonNull)
                .mapToInt(Integer::intValue)
                .max()
                .orElse(0) + 1;

        FotoAnimal foto = new FotoAnimal();
        foto.setAnimal(animal);
        foto.setOrden(orden);
        foto.setUrlImagen("pendiente");
        foto = fotoAnimalRepository.save(foto);
        foto.setUrlImagen("/animales/" + animalId + "/fotos/" + foto.getIdFoto() + "/archivo");
        foto = fotoAnimalRepository.save(foto);

        ArchivoFoto archivoFoto = new ArchivoFoto();
        archivoFoto.setFoto(foto);
        archivoFoto.setContenido(contenido);
        archivoFoto.setTipoContenido("image/jpeg");
        archivoFotoRepository.save(archivoFoto);

        return foto;
    }

    private byte[] achicarAJpeg(byte[] original) {
        BufferedImage imagen;
        try {
            imagen = ImageIO.read(new ByteArrayInputStream(original));
        } catch (IOException ex) {
            imagen = null;
        }
        if (imagen == null) {
            throw new ReglaDeNegocioException("El archivo no es una imagen valida");
        }

        double escala = Math.min(1.0, (double) LADO_MAXIMO / Math.max(imagen.getWidth(), imagen.getHeight()));
        int ancho = Math.max(1, (int) Math.round(imagen.getWidth() * escala));
        int alto = Math.max(1, (int) Math.round(imagen.getHeight() * escala));

        BufferedImage achicada = new BufferedImage(ancho, alto, BufferedImage.TYPE_INT_RGB);
        Graphics2D lienzo = achicada.createGraphics();
        lienzo.setColor(Color.WHITE);
        lienzo.fillRect(0, 0, ancho, alto);
        lienzo.drawImage(imagen.getScaledInstance(ancho, alto, Image.SCALE_SMOOTH), 0, 0, null);
        lienzo.dispose();

        BufferedImage derecha = enderezar(achicada, leerOrientacionExif(original));

        try (ByteArrayOutputStream salida = new ByteArrayOutputStream();
                ImageOutputStream flujo = ImageIO.createImageOutputStream(salida)) {
            ImageWriter escritor = ImageIO.getImageWritersByFormatName("jpeg").next();
            ImageWriteParam parametros = escritor.getDefaultWriteParam();
            parametros.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
            parametros.setCompressionQuality(CALIDAD_JPEG);
            escritor.setOutput(flujo);
            escritor.write(null, new IIOImage(derecha, null, null), parametros);
            escritor.dispose();
            flujo.flush();
            return salida.toByteArray();
        } catch (IOException ex) {
            throw new ReglaDeNegocioException("No se pudo procesar la imagen");
        }
    }

    private BufferedImage enderezar(BufferedImage imagen, int orientacion) {
        if (orientacion < 2 || orientacion > 8) {
            return imagen;
        }
        int w = imagen.getWidth();
        int h = imagen.getHeight();
        AffineTransform giro = switch (orientacion) {
            case 2 -> new AffineTransform(-1, 0, 0, 1, w, 0);
            case 3 -> new AffineTransform(-1, 0, 0, -1, w, h);
            case 4 -> new AffineTransform(1, 0, 0, -1, 0, h);
            case 5 -> new AffineTransform(0, 1, 1, 0, 0, 0);
            case 6 -> new AffineTransform(0, 1, -1, 0, h, 0);
            case 7 -> new AffineTransform(0, -1, -1, 0, h, w);
            default -> new AffineTransform(0, -1, 1, 0, 0, w);
        };
        boolean cambiaLados = orientacion >= 5;
        BufferedImage girada = new BufferedImage(cambiaLados ? h : w, cambiaLados ? w : h, BufferedImage.TYPE_INT_RGB);
        Graphics2D lienzo = girada.createGraphics();
        lienzo.drawImage(imagen, giro, null);
        lienzo.dispose();
        return girada;
    }

    private int leerOrientacionExif(byte[] b) {
        if (b.length < 4 || (b[0] & 0xFF) != 0xFF || (b[1] & 0xFF) != 0xD8) {
            return 1;
        }
        int i = 2;
        while (i + 4 <= b.length && (b[i] & 0xFF) == 0xFF) {
            int marcador = b[i + 1] & 0xFF;
            int largo = ((b[i + 2] & 0xFF) << 8) | (b[i + 3] & 0xFF);
            if (marcador == 0xDA) {
                return 1;
            }
            if (marcador == 0xE1 && i + 10 <= b.length && new String(b, i + 4, 4, java.nio.charset.StandardCharsets.US_ASCII).equals("Exif")) {
                int tiff = i + 10;
                boolean intel = tiff + 8 <= b.length && b[tiff] == 'I';
                int ifd = tiff + leerEntero(b, tiff + 4, 4, intel);
                if (ifd + 2 > b.length) {
                    return 1;
                }
                int entradas = leerEntero(b, ifd, 2, intel);
                for (int k = 0; k < entradas; k++) {
                    int entrada = ifd + 2 + k * 12;
                    if (entrada + 12 > b.length) {
                        return 1;
                    }
                    if (leerEntero(b, entrada, 2, intel) == 0x0112) {
                        return leerEntero(b, entrada + 8, 2, intel);
                    }
                }
                return 1;
            }
            i += 2 + largo;
        }
        return 1;
    }

    private int leerEntero(byte[] b, int desde, int bytes, boolean intel) {
        int valor = 0;
        for (int k = 0; k < bytes; k++) {
            int dato = b[desde + (intel ? bytes - 1 - k : k)] & 0xFF;
            valor = (valor << 8) | dato;
        }
        return valor;
    }

    @Override
    public ArchivoFoto getArchivo(Long animalId, Long fotoId) {
        animalRepository.findById(animalId)
                .filter(autorizacionService::puedeVerAnimal)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el animal con id " + animalId));

        return archivoFotoRepository.findByFoto_IdFoto(fotoId)
                .filter(archivo -> archivo.getFoto().getAnimal().getIdAnimal().equals(animalId))
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el archivo de la foto con id " + fotoId));
    }
    
}