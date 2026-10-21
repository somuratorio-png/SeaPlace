import { conductas } from '../../utils/telemetria'

const RecorridoMapa = ({ senales }) => {
  const ultima = senales[senales.length - 1]

  const opacidad = (indice) => 0.15 + 0.85 * (indice / (senales.length - 1))

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