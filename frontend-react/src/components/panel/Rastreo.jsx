import { useEffect, useState } from 'react'
import BarraProximaSenal from './BarraProximaSenal'
import DatosRastreo from './DatosRastreo'
import EncabezadoRastreo from './EncabezadoRastreo'
import LeyendaConductas from './LeyendaConductas'
import MapaRastreo from './MapaRastreo'
import NotaSimulacion from './NotaSimulacion'
import RegistroSenales from './RegistroSenales'
import { historialInicial, resumirSenales, siguienteSenal, zonaDe } from '../../utils/telemetria'

const SEGUNDOS_ENTRE_PULSOS = 5
const SENALES_EN_EL_MAPA = 24 // las últimas 48 horas
const SENALES_EN_EL_REGISTRO = 6

// Rastreo satelital del animal: el mapa con las señales. "posicion" es la última que informó el
// refugio (viene con el apadrinamiento), o null si nunca informó una.
// Funciona por pulsos, como un transmisor real: cada tanto llega una señal
// con la posición y el mapa se actualiza; entre una y otra no se sabe nada.
// El recorrido es una simulación acelerada (cada pulso representa 2 horas) que parte de "posicion".
const Rastreo = ({ animal, posicion }) => {
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

  // Los datos que se muestran salen de las señales
  const resumen = resumirSenales(senales, zona)
  const { ultima, recibidas, ultimaRecibida } = resumen

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-md space-y-space-md">
      <EncabezadoRastreo nombre={animal.nombre} perdida={ultima.perdida} enMarcha={enMarcha} onAlternar={() => setEnMarcha(!enMarcha)} />

      <MapaRastreo animal={animal} senales={recibidas.slice(-SENALES_EN_EL_MAPA)} zona={zona} />

      <BarraProximaSenal ultimaRecibida={ultimaRecibida} numeroSenal={ultima.n} enMarcha={enMarcha} segundosEntrePulsos={SEGUNDOS_ENTRE_PULSOS} />
      <LeyendaConductas />
      <DatosRastreo resumen={resumen} totalSenales={senales.length} />

      <RegistroSenales senales={senales.slice(-SENALES_EN_EL_REGISTRO)} />
      <NotaSimulacion posicion={posicion} segundosEntrePulsos={SEGUNDOS_ENTRE_PULSOS} />
    </div>
  )
}

export default Rastreo