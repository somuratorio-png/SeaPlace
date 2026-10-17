import { conductas } from '../../utils/telemetria'

// El recorrido: una línea recta entre señal y señal (la más nueva se dibuja de punta a punta) y un punto
// por cada señal, del color de lo que el animal estaba haciendo. "senales" van de la más vieja a la más nueva.
// Va dentro de un <svg>.
const RecorridoMapa = ({ senales }) => {
  const ultima = senales[senales.length - 1]

  // Cuanto más vieja es una señal, más transparente se dibuja
  const opacidad = (indice) => 0.15 + 0.85 * (indice / (senales.length - 1))

  // Un tramo une cada señal con la anterior (por eso se saltea la primera)
  const tramos = senales.slice(1).map((senal, indice) => ({ desde: senales[indice], hasta: senal, indice: indice + 1 }))

  return (
    <>
      {tramos.map((tramo) => (
        <path
          key={tramo.hasta.n}
          d={`M ${tramo.desde.x} ${tramo.desde.y} L ${tramo.hasta.x} ${tramo.hasta.y}`}
          pathLength="1"
          className={tramo.hasta.n === ultima.n ? 'trazar' : ''}
          fill="none"
          stroke="#ffffff"
          strokeOpacity={opacidad(tramo.indice) * 0.7}
          strokeWidth="0.35"
          strokeLinecap="round"
        />
      ))}

      {senales.map((senal, indice) => (
        <circle key={senal.n} cx={senal.x} cy={senal.y} r="0.75" fill={conductas[senal.conducta].color} fillOpacity={opacidad(indice)} stroke="#052f41" strokeWidth="0.15" />
      ))}
    </>
  )
}

export default RecorridoMapa