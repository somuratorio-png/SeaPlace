const soloDigitos = (texto) => texto.replace(/\D/g, '')

export const limpiarCampoTarjeta = {
  titular: (texto) => texto.replace(/[^\p{L} ]/gu, '').slice(0, 40),
  numero: (texto) => soloDigitos(texto).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '),
  vencimiento: (texto) => soloDigitos(texto).slice(0, 4).replace(/(\d{2})(?=\d)/, '$1/'),
  codigo: (texto) => soloDigitos(texto).slice(0, 3),
}

const estaVencida = (mes, anio) => {
  const hoy = new Date()
  const anioActual = hoy.getFullYear() % 100
  const mesActual = hoy.getMonth() + 1
  return anio < anioActual || (anio === anioActual && mes < mesActual)
}

export const validarTarjeta = (datos) => {
  const mes = Number(datos.vencimiento.slice(0, 2))
  const anio = Number(datos.vencimiento.slice(3, 5))

  if (datos.titular.trim().length < 3) {
    return 'Escribí el nombre del titular como figura en la tarjeta'
  }
  if (soloDigitos(datos.numero).length !== 16) {
    return 'El número de tarjeta tiene que tener 16 dígitos'
  }
  if (datos.vencimiento.length !== 5 || mes < 1 || mes > 12) {
    return 'El vencimiento va con el formato MM/AA y un mes entre 01 y 12, por ejemplo 08/29'
  }
  if (estaVencida(mes, anio)) {
    return 'La tarjeta está vencida'
  }
  if (datos.codigo.length !== 3) {
    return 'El código de seguridad son los 3 dígitos del dorso'
  }
  return null
}