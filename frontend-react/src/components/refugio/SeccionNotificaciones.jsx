import { useEffect } from 'react'
import { formatearFecha } from '../../utils/fechas'
import EstadoCarga from '../comunes/EstadoCarga'
import Icono from '../comunes/Icono'
import MensajeError from '../comunes/MensajeError'
import MensajeVacio from '../comunes/MensajeVacio'
import TituloSeccion from '../comunes/TituloSeccion'

const SeccionNotificaciones = ({ notificaciones, cargando, error, errorAlMarcar, onMarcarLeidas }) => {
  useEffect(() => {
    if (!cargando) {
      onMarcarLeidas()
    }
  }, [cargando, onMarcarLeidas])

  if (cargando || error) {
    return <EstadoCarga cargando={cargando} error={error} texto="Cargando tus notificaciones…" />
  }

  return (
    <section className="space-y-space-md">
      <TituloSeccion>Notificaciones</TituloSeccion>
      {errorAlMarcar && <MensajeError mensaje={errorAlMarcar} />}

      {notificaciones.length === 0 && (
        <MensajeVacio clase="bg-surface-container rounded-2xl p-space-lg">Todavía no tenés notificaciones. Acá te vamos a avisar cuando revisemos tus publicaciones.</MensajeVacio>
      )}
      {notificaciones.map((notificacion) => {
        const esNueva = notificacion.nueva || !notificacion.leida
        return (
          <article
            key={notificacion.id}
            className={`revelar bg-surface-container-lowest rounded-2xl shadow-sm p-space-md flex items-start gap-space-md border-l-4 ${esNueva ? 'border-tertiary' : 'border-transparent'}`}
          >
            <div className="w-10 h-10 shrink-0 rounded-full bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center">
              <Icono nombre="notifications" clase="text-[20px]" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-body-md text-body-md text-on-surface">{notificacion.texto}</p>
              <p className="font-label-md text-label-md text-on-surface-variant">
                {formatearFecha(notificacion.fecha)}
                {esNueva && <span className="ml-space-sm text-tertiary">· Nueva</span>}
              </p>
            </div>
          </article>
        )
      })}
    </section>
  )
}

export default SeccionNotificaciones
