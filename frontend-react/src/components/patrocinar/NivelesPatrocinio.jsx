import Icono from '../comunes/Icono'
import Precio from '../comunes/Precio'
import TituloSeccion from '../comunes/TituloSeccion'
import { niveles } from '../../services/patrocinadores'

// Los tres niveles, de menor a mayor, con desde cuánto se llega y qué incluye cada uno
const NivelesPatrocinio = () => {
  const deMenorAMayor = [...niveles].reverse()

  return (
    <section className="space-y-space-lg">
      <TituloSeccion>Niveles de patrocinio</TituloSeccion>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
        Tu nivel sale de cuánto te comprometés a duplicar sumando todas tus campañas. Cuanto más alto, más visible es tu marca.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        {deMenorAMayor.map((nivel) => (
          <div key={nivel.codigo} className={`rounded-2xl p-space-lg space-y-space-md shadow-sm ${nivel.codigo === 'OCEANO' ? 'ring-2 ring-primary bg-surface-container-lowest' : 'bg-surface-container-lowest'}`}>
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-1 px-space-md py-1 rounded-full font-label-lg text-label-lg ${nivel.clase}`}>
                <Icono nombre={nivel.icono} clase="text-[18px]" /> {nivel.nombre}
              </span>
              {nivel.codigo === 'OCEANO' && <span className="font-label-md text-label-md text-primary">Máxima visibilidad</span>}
            </div>
            <p className="font-headline-sm text-headline-sm text-primary">
              {nivel.desde === 0 ? 'Desde tu primera campaña' : <>Desde <Precio valor={nivel.desde} /></>}
            </p>
            <ul className="space-y-space-xs">
              {nivel.beneficios.map((beneficio) => (
                <li key={beneficio} className="flex gap-space-sm font-body-md text-body-md text-on-surface">
                  <Icono nombre="check_circle" clase="text-secondary text-[20px] shrink-0" /> {beneficio}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

export default NivelesPatrocinio
