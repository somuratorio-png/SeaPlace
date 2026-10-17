import { formatearFecha } from '../../utils/fechas'
import { HORAS_ENTRE_SENALES } from '../../utils/telemetria'

// Aclara de dónde parte el mapa y que el recorrido es una simulación acelerada.
// "posicion" es la última que informó el refugio, o null si nunca informó una.
const NotaSimulacion = ({ posicion, segundosEntrePulsos }) => {
  return (
    <p className="font-body-sm text-body-sm text-on-surface-variant">
      {posicion
        ? `El mapa parte de la última posición que informó su refugio el ${formatearFecha(posicion.fecha)} (${posicion.latitud}, ${posicion.longitud}). `
        : 'Su refugio todavía no informó ninguna posición, así que el mapa parte de un punto de referencia. '}
      Desde ahí el recorrido es una simulación acelerada: cada señal equivale a {HORAS_ENTRE_SENALES} horas reales y llega cada {segundosEntrePulsos} segundos.
    </p>
  )
}

export default NotaSimulacion