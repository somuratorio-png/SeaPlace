const LARGO_MINIMO_CONTRASENIA = 8

// Devuelve el mensaje de error si la contraseña es muy corta, o null si está bien.
// "sujeto" es cómo se llama en el mensaje (por ejemplo "La contraseña nueva").
export const validarContrasenia = (contrasenia, sujeto = 'La contraseña') =>
  contrasenia.length < LARGO_MINIMO_CONTRASENIA ? `${sujeto} debe tener al menos ${LARGO_MINIMO_CONTRASENIA} caracteres` : null

// Revisa lo básico de un animal nuevo antes de mandarlo al backend (que valida todo de nuevo).
// Devuelve el mensaje de error, o null si está bien.
export const validarAnimalNuevo = (datos) => {
  const guardian = Number(datos.precio)
  const marea = Number(datos.precioMarea)
  if (guardian <= 0 || marea <= 0) {
    return 'La cuota de cada plan tiene que ser mayor a 0'
  }
  // Misma regla que el backend: Marea Profunda incluye todo lo de Guardián de la Bahía, así que tiene que costar más
  if (guardian >= marea) {
    return 'Marea Profunda tiene que costar más que Guardián de la Bahía.'
  }
  // Misma regla que el backend: los cupos tienen que ser un número entero mayor a 0
  const cupos = Number(datos.cuposTotales)
  if (!Number.isInteger(cupos) || cupos <= 0) {
    return 'Los cupos tienen que ser un número entero mayor a 0'
  }
  return null
}

export const validarRangoPrecio = (minimo, maximo) => {
  if (Number(minimo) < 0 || Number(maximo) < 0) {
    return 'Las cuotas no pueden ser negativas'
  }
  if (minimo !== '' && maximo !== '' && Number(minimo) > Number(maximo)) {
    return 'La cuota mínima no puede ser mayor que la máxima'
  }
  return null
}