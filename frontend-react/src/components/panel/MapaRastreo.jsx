import EscalaYNorte from './EscalaYNorte'
import FondoMapa from './FondoMapa'
import MarcadorAnimal from './MarcadorAnimal'
import RecorridoMapa from './RecorridoMapa'
import ZonaHabitual from './ZonaHabitual'

// Dibujo del mapa. No muestra al animal moviéndose: muestra las señales que fueron llegando
// (un punto por cada una), unidas por una línea, y el marcador en la última posición conocida.
// "senales" son solo las que llegaron bien, de la más vieja a la más nueva.
const MapaRastreo = ({ animal, senales, zona }) => {
  const ultima = senales[senales.length - 1]

  return (
    <svg viewBox="0 0 100 60" className="block w-full rounded-2xl shadow-inner" role="img" aria-label={`Mapa con las últimas señales de ${animal.nombre}`}>
      <FondoMapa />
      <ZonaHabitual zona={zona} />
      <RecorridoMapa senales={senales} />
      <MarcadorAnimal animal={animal} ultima={ultima} />
      <EscalaYNorte />
    </svg>
  )
}

export default MapaRastreo