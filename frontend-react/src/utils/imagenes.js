const LADO_MAXIMO = 800 // en píxeles

// Convierte una foto elegida por el usuario en un texto (data URL) que se puede usar como
// src de un <img> y guardar en el navegador. Antes la achica, porque una foto de celular
// entera ocuparía demasiado espacio.
const achicarFoto = async (archivo) => {
  const imagen = await createImageBitmap(archivo)
  const escala = Math.min(1, LADO_MAXIMO / Math.max(imagen.width, imagen.height))

  const lienzo = document.createElement('canvas')
  lienzo.width = Math.round(imagen.width * escala)
  lienzo.height = Math.round(imagen.height * escala)
  lienzo.getContext('2d').drawImage(imagen, 0, 0, lienzo.width, lienzo.height)

  return lienzo.toDataURL('image/jpeg', 0.8)
}

// Recibe los archivos de un <input type="file"> y devuelve una promesa con todas las fotos listas
export const leerFotos = (archivos) => Promise.all([...archivos].map(achicarFoto))
