import Icono from './Icono'
import Precio from './Precio'
import { formatearFecha } from '../../utils/fechas'

// El sello de un animal con una campaña de duplicación vigente. "patrocinio" = { empresa, icono, restante, hasta }.
// En la tarjeta del catálogo va compacto; en la ficha (detallado) explica cómo funciona y cuánto queda.
const SelloPatrocinio = ({ patrocinio, detallado = false }) => {
  if (!detallado) {
    return (
      <p className="inline-flex items-center gap-1 self-start bg-tertiary-fixed text-on-tertiary-fixed rounded-full px-space-sm py-1 font-label-md text-label-md">
        <Icono nombre={patrocinio.icono} clase="text-[16px]" />
        {patrocinio.empresa} duplica tu aporte
      </p>
    )
  }

  return (
    <div className="bg-tertiary-fixed text-on-tertiary-fixed rounded-xl p-space-md flex gap-space-md items-start">
      <div className="w-10 h-10 shrink-0 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center">
        <Icono nombre="volunteer_activism" clase="text-[22px]" />
      </div>
      <div className="space-y-1">
        <p className="font-title-lg text-title-lg">Patrocinado por {patrocinio.empresa}</p>
        <p className="font-body-sm text-body-sm">
          Por cada peso que aportes, {patrocinio.empresa} pone otro. Quedan <b><Precio valor={patrocinio.restante} /></b> para duplicar, hasta el {formatearFecha(patrocinio.hasta)}.
        </p>
      </div>
    </div>
  )
}

export default SelloPatrocinio
