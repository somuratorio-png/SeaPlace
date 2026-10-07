// Convierte una lista de puntos [x, y] en un camino SVG cerrado y con curvas suaves
// (en vez de líneas rectas entre punto y punto). Usa curvas de Catmull-Rom.
export const armarCamino = (puntos) => {
  const total = puntos.length
  const punto = (indice) => puntos[(indice + total) % total]

  const tramos = puntos.map((actual, i) => {
    const anterior = punto(i - 1)
    const siguiente = punto(i + 1)
    const posterior = punto(i + 2)

    // Dos puntos de control que "tiran" de la curva para que no haga esquinas
    const control1 = [actual[0] + (siguiente[0] - anterior[0]) / 6, actual[1] + (siguiente[1] - anterior[1]) / 6]
    const control2 = [siguiente[0] - (posterior[0] - actual[0]) / 6, siguiente[1] - (posterior[1] - actual[1]) / 6]

    return `C ${control1.join(' ')} ${control2.join(' ')} ${siguiente.join(' ')}`
  })

  return `M ${puntos[0].join(' ')} ${tramos.join(' ')} Z`
}
