import EscalaYNorte from './EscalaYNorte'
import FondoMapa from './FondoMapa'
import MarcadorAnimal from './MarcadorAnimal'
import RecorridoMapa from './RecorridoMapa'
import ZonaHabitual from './ZonaHabitual'

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