const LARGO_MINIMO_CONTRASENIA = 8

export const validarContrasenia = (contrasenia, sujeto = 'La contraseña') =>
  contrasenia.length < LARGO_MINIMO_CONTRASENIA ? `${sujeto} debe tener al menos ${LARGO_MINIMO_CONTRASENIA} caracteres` : null

export const validarAnimalNuevo = (datos) => {
  const brisa = Number(datos.precioBrisa)
  const guardian = Number(datos.precio)
  const marea = Number(datos.precioMarea)
  if (brisa <= 0 || guardian <= 0 || marea <= 0) {
    return 'La cuota de cada plan tiene que ser mayor a 0'
  }
  if (brisa >= guardian || guardian >= marea) {
    return 'Los planes van de menor a mayor: Brisa Marina < Guardián de la Bahía < Marea Profunda.'
  }
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