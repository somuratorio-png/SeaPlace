import { useEffect, useState } from 'react'
import { traerUltimaUbicacion } from '../../services/animales'
import { formatearFecha } from '../../utils/fechas'
import { conductas, coordenadasDe, historialInicial, horaDe, HORAS_ENTRE_SENALES, siguienteSenal, zonaDe } from '../../utils/telemetria'
import Icono from '../comunes/Icono'
import DatoRastreo from './DatoRastreo'
import MapaRastreo from './MapaRastreo'
import RegistroSenales from './RegistroSenales'

const SEGUNDOS_ENTRE_PULSOS = 5
const SENALES_EN_EL_MAPA = 24 // las últimas 48 horas
const SENALES_EN_EL_REGISTRO = 6

// Rastreo satelital del animal. Primero le pide al backend la última posición que informó el refugio
// y, cuando llega, muestra el mapa centrado ahí. Mientras espera muestra un aviso.
// posicion: undefined = todavía no llegó la respuesta; null = el refugio nunca informó una.
const Rastreo = ({ animal }) => {
  const [posicion, setPosicion] = useState(undefined)

  useEffect(() => {
    traerUltimaUbicacion(animal.id)
      .then(setPosicion)
      .catch(() => setPosicion(null))
  }, [animal.id])

  if (posicion === undefined) {
    return <p className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-md font-body-md text-body-md text-on-surface-variant">Buscando la señal de {animal.nombre}…</p>
  }
  return <RastreoEnVivo animal={animal} posicion={posicion} />
}

// El mapa con las señales. Funciona por pulsos, como un transmisor real: cada tanto llega una señal
// con la posición y el mapa se actualiza; entre una y otra no se sabe nada.
// El recorrido es una simulación acelerada (cada pulso representa 2 horas) que parte de "posicion".
const RastreoEnVivo = ({ animal, posicion }) => {
  // La zona no cambia mientras se mira el mapa: se calcula una sola vez
  const [zona] = useState(() => zonaDe(animal, posicion))
  // Arranca con un recorrido ya hecho, para que el mapa no esté vacío
  const [senales, setSenales] = useState(() => historialInicial(animal, zona, SENALES_EN_EL_MAPA))
  const [enMarcha, setEnMarcha] = useState(true)

  useEffect(() => {
    if (!enMarcha) {
      return
    }

    // Cada pulso calcula la señal siguiente a partir de la última y la agrega al final
    const intervalo = setInterval(() => {
      setSenales((actuales) => [...actuales, siguienteSenal(actuales[actuales.length - 1], animal, zona)].slice(-60))
    }, SEGUNDOS_ENTRE_PULSOS * 1000)

    // Al pausar o salir de la pantalla se corta el intervalo
    return () => clearInterval(intervalo)
  }, [enMarcha, animal, zona])

  const ultima = senales[senales.length - 1] // puede ser una señal perdida
  const recibidas = senales.filter((senal) => !senal.perdida)
  const ultimaRecibida = recibidas[recibidas.length - 1]

  // Datos calculados a partir de las señales
  const velocidad = ultimaRecibida.tramo / HORAS_ENTRE_SENALES
  const kmUltimoDia = senales.slice(-12).reduce((suma, senal) => suma + senal.tramo, 0)
  const kmAlRefugio = Math.hypot(ultimaRecibida.x - zona.x, ultimaRecibida.y - zona.y)
  const bateria = Math.max(20, 92 - ultima.n * 0.08)

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-md space-y-space-md">
      <div className="flex flex-wrap items-center justify-between gap-space-sm">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-primary">Rastreo satelital</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            El transmisor de {animal.nombre} envía su posición cada {HORAS_ENTRE_SENALES} horas, cuando sale a la superficie.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-md">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-space-md py-1 font-label-md text-label-md ${
              ultima.perdida ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' : 'bg-secondary-container text-on-secondary-fixed-variant'
            }`}
          >
            <Icono nombre={ultima.perdida ? 'signal_disconnected' : 'satellite_alt'} clase="text-[16px]" />
            {ultima.perdida ? 'Sin señal' : 'Señal recibida'}
          </span>
          <button
            onClick={() => setEnMarcha(!enMarcha)}
            className="inline-flex items-center gap-1 bg-primary text-on-primary font-label-lg text-label-lg px-space-md py-space-sm rounded-full hover:bg-surface-tint"
          >
            <Icono nombre={enMarcha ? 'pause' : 'play_arrow'} clase="text-[18px]" />
            {enMarcha ? 'Pausar' : 'Reanudar'}
          </button>
        </div>
      </div>

      <MapaRastreo animal={animal} senales={recibidas.slice(-SENALES_EN_EL_MAPA)} zona={zona} />

      {/* Barrita que se vacía hasta el próximo pulso. La "key" la reinicia con cada señal. */}
      <div className="space-y-1">
        <div className="flex flex-wrap justify-between gap-space-sm font-label-md text-label-md text-on-surface-variant">
          <span>
            Última señal: {horaDe(ultimaRecibida)} · {coordenadasDe(ultimaRecibida)}
          </span>
          <span>{enMarcha ? 'Esperando la próxima señal…' : 'Rastreo en pausa'}</span>
        </div>
        <div className="h-1.5 bg-primary-fixed rounded-full overflow-hidden">
          {enMarcha && <div key={ultima.n} className="esperar h-full bg-secondary rounded-full" style={{ animationDuration: `${SEGUNDOS_ENTRE_PULSOS}s` }} />}
        </div>
      </div>

      {/* Qué significa el color de cada punto del mapa */}
      <div className="flex flex-wrap gap-x-space-md gap-y-1 font-label-md text-label-md text-on-surface-variant">
        {Object.values(conductas).map((conducta) => (
          <span key={conducta.nombre} className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full ring-1 ring-outline" style={{ backgroundColor: conducta.color }} />
            {conducta.nombre}
          </span>
        ))}
        <span>· Círculo punteado: su zona habitual</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-sm">
        <DatoRastreo icono="pets" titulo="Qué está haciendo" valor={ultima.perdida ? 'Buceando' : conductas[ultima.conducta].nombre} />
        <DatoRastreo icono="speed" titulo="Velocidad media" valor={`${velocidad.toFixed(1)} km/h`} />
        <DatoRastreo icono="route" titulo="Últimas 24 h" valor={`${kmUltimoDia.toFixed(1)} km`} />
        <DatoRastreo icono="home_pin" titulo="Del refugio" valor={`${kmAlRefugio.toFixed(1)} km`} />
        <DatoRastreo icono="scuba_diving" titulo="Profundidad" valor={`${ultimaRecibida.profundidad.toFixed(0)} m`} />
        <DatoRastreo icono="timeline" titulo="Recorrido total" valor={`${ultima.km.toFixed(0)} km`} />
        <DatoRastreo icono="cell_tower" titulo="Señales recibidas" valor={`${recibidas.length} de ${senales.length}`} />
        <DatoRastreo icono="battery_5_bar" titulo="Batería" valor={`${bateria.toFixed(0)} %`} />
      </div>

      <RegistroSenales senales={senales.slice(-SENALES_EN_EL_REGISTRO)} />

      <p className="font-body-sm text-body-sm text-on-surface-variant">
        {posicion
          ? `El mapa parte de la última posición que informó su refugio el ${formatearFecha(posicion.fecha)} (${posicion.latitud}, ${posicion.longitud}). `
          : 'Su refugio todavía no informó ninguna posición, así que el mapa parte de un punto de referencia. '}
        Desde ahí el recorrido es una simulación acelerada: cada señal equivale a {HORAS_ENTRE_SENALES} horas reales y llega cada {SEGUNDOS_ENTRE_PULSOS} segundos.
      </p>
    </div>
  )
}

export default Rastreo
