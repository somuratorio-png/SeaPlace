import { useState } from 'react'
import { useSelector } from 'react-redux'
import Precio from '../comunes/Precio'
import TituloSeccion from '../comunes/TituloSeccion'
import { nivelDe, niveles } from '../../services/patrocinadores'

const MINIMO = 50
const MAXIMO = 3000

// "¿Cuánto rinde tu aporte?": la empresa mueve el tope y ve cuánto moviliza, cuántas cuotas de padrinos
// acompaña (con la cuota promedio del catálogo) y en qué nivel quedaría. Todo se calcula acá, sin pedir nada.
const SimuladorImpacto = () => {
  const { items: animales } = useSelector((state) => state.animales)
  const [tope, setTope] = useState(500)

  const cuotaPromedio = animales.length > 0 ? animales.reduce((suma, animal) => suma + animal.precio, 0) / animales.length : 5
  const cuotas = Math.floor(tope / cuotaPromedio)
  const codigoNivel = niveles.find((nivel) => tope >= nivel.desde).codigo
  const nivel = nivelDe(codigoNivel)

  return (
    <section className="space-y-space-lg">
      <TituloSeccion>¿Cuánto rinde tu aporte?</TituloSeccion>
      <div className="fondo-mar text-on-primary rounded-2xl p-space-lg lg:p-space-xl shadow-md grid grid-cols-1 lg:grid-cols-5 gap-space-lg items-center">
        <label htmlFor="topeSimulado" className="lg:col-span-2 space-y-space-sm">
          <span className="font-title-lg text-title-lg block">Si tu empresa se compromete a duplicar hasta</span>
          <span className="font-headline-lg text-headline-lg block">
            <Precio valor={tope} />
          </span>
          <input
            type="range"
            id="topeSimulado"
            name="topeSimulado"
            min={MINIMO}
            max={MAXIMO}
            step="50"
            value={tope}
            onChange={(evento) => setTope(Number(evento.target.value))}
            className="w-full accent-tertiary"
          />
          <span className="font-label-md text-label-md text-primary-fixed block">Montos en US$ convertidos a la moneda elegida</span>
        </label>

        <dl className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-space-md text-center [&_dd]:whitespace-nowrap">
          <div className="bg-white/10 rounded-xl p-space-md">
            <dt className="font-label-md text-label-md text-primary-fixed">Movilizás</dt>
            <dd className="font-headline-sm text-headline-sm">
              <Precio valor={tope * 2} />
            </dd>
          </div>
          <div className="bg-white/10 rounded-xl p-space-md">
            <dt className="font-label-md text-label-md text-primary-fixed">Acompañás</dt>
            <dd className="font-headline-sm text-headline-sm">{cuotas} cuotas</dd>
          </div>
          <div className="bg-white/10 rounded-xl p-space-md">
            <dt className="font-label-md text-label-md text-primary-fixed">Tu nivel</dt>
            <dd className="font-headline-sm text-headline-sm">{nivel.nombre}</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

export default SimuladorImpacto
