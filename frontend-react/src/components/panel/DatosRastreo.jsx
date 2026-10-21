import DatoRastreo from './DatoRastreo'
import { conductas } from '../../utils/telemetria'

// Los ocho datos en vivo del rastreo. "resumen" sale de resumirSenales; "totalSenales" es la cantidad
// de señales que se esperaban, lleguen o no.
const DatosRastreo = ({ resumen, totalSenales }) => {
  const { ultima, recibidas, ultimaRecibida, velocidad, kmUltimoDia, kmAlRefugio, bateria } = resumen

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-space-sm">
      <DatoRastreo icono="pets" titulo="Qué está haciendo" valor={ultima.perdida ? 'Buceando' : conductas[ultima.conducta].nombre} />
      <DatoRastreo icono="speed" titulo="Velocidad media" valor={`${velocidad.toFixed(1)} km/h`} />
      <DatoRastreo icono="route" titulo="Últimas 24 h" valor={`${kmUltimoDia.toFixed(1)} km`} />
      <DatoRastreo icono="home_pin" titulo="Del refugio" valor={`${kmAlRefugio.toFixed(1)} km`} />
      <DatoRastreo icono="scuba_diving" titulo="Profundidad" valor={`${ultimaRecibida.profundidad.toFixed(0)} m`} />
      <DatoRastreo icono="timeline" titulo="Recorrido total" valor={`${ultima.km.toFixed(0)} km`} />
      <DatoRastreo icono="cell_tower" titulo="Señales recibidas" valor={`${recibidas.length} de ${totalSenales}`} />
      <DatoRastreo icono="battery_5_bar" titulo="Batería" valor={`${bateria.toFixed(0)} %`} />
    </div>
  )
}

export default DatosRastreo