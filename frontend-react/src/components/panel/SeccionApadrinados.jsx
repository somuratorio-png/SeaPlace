import { useState } from 'react'
import Buscador from '../comunes/Buscador'
import EstadoCarga from '../comunes/EstadoCarga'
import MensajeVacio from '../comunes/MensajeVacio'
import TituloSeccion from '../comunes/TituloSeccion'
import SinApadrinados from './SinApadrinados'
import TarjetaApadrinado from './TarjetaApadrinado'
import { paraBuscar, textoDelAnimal } from '../../utils/texto'

const SeccionApadrinados = ({ cargando, error, apadrinados, onVer, onElegir }) => {
  const [busqueda, setBusqueda] = useState('')

  const texto = paraBuscar(busqueda)
  const visibles = apadrinados.filter((item) => paraBuscar(textoDelAnimal(item.animal)).includes(texto))

  const elegirContenido = () => {
    if (cargando || error) {
      return <EstadoCarga cargando={cargando} error={error} texto="Cargando a tus apadrinados…" />
    }

    if (apadrinados.length === 0) {
      return <SinApadrinados onElegir={onElegir} />
    }

    return (
      <>
        <Buscador valor={busqueda} onCambiar={setBusqueda} textoAyuda="Buscar entre tus apadrinados..." />

        {visibles.length === 0 && <MensajeVacio clase="py-space-lg">Ningún apadrinado coincide con esa búsqueda.</MensajeVacio>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {visibles.map((item) => (
            <TarjetaApadrinado key={item.id} item={item} onVer={onVer} />
          ))}
        </div>
      </>
    )
  }

  return (
    <section className="space-y-space-md">
      <TituloSeccion>Tus apadrinados</TituloSeccion>
      {elegirContenido()}
    </section>
  )
}

export default SeccionApadrinados