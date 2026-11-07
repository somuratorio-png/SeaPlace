import { useSelector } from 'react-redux'
import EstadoCarga from '../comunes/EstadoCarga'
import MensajeVacio from '../comunes/MensajeVacio'
import TituloSeccion from '../comunes/TituloSeccion'
import TarjetaPropuesta from './TarjetaPropuesta'

// Sección "Patrocinios" del refugio: las campañas de duplicación que proponen las empresas para sus animales.
// Primero las que esperan respuesta (se aceptan o se rechazan), después el historial.
// Las pidió PanelRefugio al montarse: acá se leen del estado global.
const SeccionPatrocinios = () => {
  const { items: campanias, loading: cargando, error } = useSelector((state) => state.campanias)

  if (cargando || error) {
    return <EstadoCarga cargando={cargando} error={error} texto="Cargando los patrocinios…" />
  }

  const pendientes = campanias.filter((campania) => campania.pendiente)
  const respondidas = campanias.filter((campania) => !campania.pendiente)

  return (
    <section className="space-y-space-lg">
      <TituloSeccion>Patrocinios</TituloSeccion>
      <p className="font-body-md text-body-md text-on-surface-variant">
        Cuando una empresa quiere duplicar los aportes que reciben tus animales, te llega acá. Si la aceptás, desde ese día cada peso que ponga un padrino se duplica, hasta el tope de la campaña.
      </p>

      {campanias.length === 0 && (
        <MensajeVacio clase="bg-surface-container rounded-2xl p-space-lg">Todavía ninguna empresa propuso patrocinar a tus animales.</MensajeVacio>
      )}

      {pendientes.length > 0 && (
        <div className="space-y-space-md">
          <h3 className="font-title-lg text-title-lg text-primary">Esperan tu respuesta ({pendientes.length})</h3>
          {pendientes.map((campania) => (
            <TarjetaPropuesta key={campania.id} campania={campania} />
          ))}
        </div>
      )}

      {respondidas.length > 0 && (
        <div className="space-y-space-md">
          <h3 className="font-title-lg text-title-lg text-on-surface">Historial</h3>
          {respondidas.map((campania) => (
            <TarjetaPropuesta key={campania.id} campania={campania} />
          ))}
        </div>
      )}
    </section>
  )
}

export default SeccionPatrocinios
