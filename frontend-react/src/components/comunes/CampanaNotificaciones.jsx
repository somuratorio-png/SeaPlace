import { useEffect, useState } from 'react'
import { formatearFecha } from '../../utils/fechas'
import { useNotificaciones } from '../../hooks/useNotificaciones'
import Icono from './Icono'

// Campanita del header con el número de notificaciones sin leer. Al tocarla se despliegan
// y se marcan como leídas (las que eran nuevas se siguen resaltando).
// Se cierra al tocar afuera (cuando el foco sale de la campanita y su panel) o con Escape.
const CampanaNotificaciones = () => {
  const { notificaciones, sinLeer, cargando, error, errorAlMarcar, marcarLeidas } = useNotificaciones()
  const [abierta, setAbierta] = useState(false)

  // Al abrirla se marcan como leídas
  useEffect(() => {
    if (abierta) {
      marcarLeidas()
    }
  }, [abierta, marcarLeidas])

  // Si el foco pasa a algo que no es parte de la campanita (se tocó afuera), se cierra
  const alPerderFoco = (evento) => {
    if (!evento.currentTarget.contains(evento.relatedTarget)) {
      setAbierta(false)
    }
  }

  const alTeclear = (evento) => {
    if (evento.key === 'Escape') {
      setAbierta(false)
    }
  }

  return (
    <div className="relative" onBlur={alPerderFoco} onKeyDown={alTeclear}>
      <button
        onClick={() => setAbierta(!abierta)}
        aria-expanded={abierta}
        aria-label={sinLeer > 0 ? `Notificaciones: ${sinLeer} sin leer` : 'Notificaciones'}
        title="Notificaciones"
        className="relative w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary-fixed/50"
      >
        <Icono nombre="notifications" clase="text-[22px]" />
        {sinLeer > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-tertiary text-on-tertiary font-label-md text-label-md flex items-center justify-center">
            {sinLeer > 9 ? '9+' : sinLeer}
          </span>
        )}
      </button>

      {/* tabIndex={-1}: tocar adentro del panel le pasa el foco a él, así no cuenta como tocar afuera */}
      {abierta && (
        <div tabIndex={-1} className="absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-2rem))] bg-surface-container-lowest rounded-2xl shadow-lg ring-1 ring-primary-fixed overflow-hidden outline-none">
          <p className="px-space-md py-space-sm font-label-lg text-label-lg text-on-surface border-b border-primary-fixed">Notificaciones</p>
          {errorAlMarcar && <p className="px-space-md pt-space-sm font-body-sm text-body-sm text-error">{errorAlMarcar}</p>}
          <div className="max-h-96 overflow-y-auto">
            {cargando && <p className="px-space-md py-space-md font-body-sm text-body-sm text-on-surface-variant">Cargando…</p>}
            {!cargando && error && <p className="px-space-md py-space-md font-body-sm text-body-sm text-error">{error}</p>}
            {!cargando && !error && notificaciones.length === 0 && (
              <p className="px-space-md py-space-md font-body-sm text-body-sm text-on-surface-variant">Todavía no tenés notificaciones.</p>
            )}
            {!cargando &&
              !error &&
              notificaciones.map((notificacion) => {
                const esNueva = notificacion.nueva || !notificacion.leida
                return (
                  <div key={notificacion.id} className={`px-space-md py-space-sm border-l-4 ${esNueva ? 'border-tertiary bg-tertiary-fixed/30' : 'border-transparent'}`}>
                    <p className="font-body-sm text-body-sm text-on-surface">{notificacion.texto}</p>
                    <p className="font-label-md text-label-md text-on-surface-variant">{formatearFecha(notificacion.fecha)}</p>
                  </div>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}

export default CampanaNotificaciones
