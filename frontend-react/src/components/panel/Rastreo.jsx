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
const SENALES_EN_EL_MAPA = 24
const SENALES_EN_EL_REGISTRO = 6

const Rastreo = ({ animal, posicion }) => {
  const [zona] = useState(() => zonaDe(animal, posicion))
  const [senales, setSenales] = useState(() => historialInicial(animal, zona, SENALES_EN_EL_MAPA))
  const [enMarcha, setEnMarcha] = useState(true)

  useEffect(() => {
    if (!enMarcha) {
      return
    }

    const intervalo = setInterval(() => {
      setSenales((actuales) => [...actuales, siguienteSenal(actuales[actuales.length - 1], animal, zona)].slice(-60))
    }, SEGUNDOS_ENTRE_PULSOS * 1000)

    return () => clearInterval(intervalo)
  }, [enMarcha, animal, zona])

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