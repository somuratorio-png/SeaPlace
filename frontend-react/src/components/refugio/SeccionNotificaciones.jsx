import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { marcarLeidas } from '../../Redux/notificacionesSlice'
import { temaDe } from '../../services/notificaciones'
import { formatearFecha } from '../../utils/fechas'
import EstadoCarga from '../comunes/EstadoCarga'
import FiltroTemas from '../comunes/FiltroTemas'
import Icono from '../comunes/Icono'
import MensajeError from '../comunes/MensajeError'
import MensajeVacio from '../comunes/MensajeVacio'
import TituloSeccion from '../comunes/TituloSeccion'

// Sección "Notificaciones" del refugio: los avisos de SeaPlace agrupados por tema (comentarios de padrinos,
// patrocinios, publicaciones). Al abrirla se marcan como leídas, pero las que eran nuevas (nueva: true,
// ver notificacionesSlice) se siguen resaltando. Las pide la campanita del header y se leen del estado global.
const SeccionNotificaciones = () => {
  const dispatch = useDispatch()
  const { items: notificaciones, loading: cargando, error, errorAccion: errorAlMarcar } = useSelector((state) => state.notificaciones)
  const [tema, setTema] = useState(null) // el tema elegido para filtrar, o null para todas
  const sinLeer = notificaciones.filter((notificacion) => !notificacion.leida).length
  const visibles = tema === null ? notificaciones : notificaciones.filter((notificacion) => notificacion.tema === tema)

  // Apenas terminan de llegar del backend, si hay alguna sin leer. Después de marcarlas sinLeer queda en 0
  // y esto no se vuelve a despachar.
  useEffect(() => {
    if (!cargando && sinLeer > 0) {
      dispatch(marcarLeidas())
    }
  }, [cargando, sinLeer, dispatch])

  if (cargando || error) {
    return <EstadoCarga cargando={cargando} error={error} texto="Cargando tus notificaciones…" />
  }

  return (
    <section className="space-y-space-md">
      <TituloSeccion>Notificaciones</TituloSeccion>
      {errorAlMarcar && <MensajeError mensaje={errorAlMarcar} />}
      <FiltroTemas notificaciones={notificaciones} elegido={tema} onElegir={setTema} />

      {notificaciones.length === 0 && (
        <MensajeVacio clase="bg-surface-container rounded-2xl p-space-lg">
          Todavía no tenés notificaciones. Acá te vamos a avisar cuando revisemos tus publicaciones, cuando un padrino comente o cuando una empresa quiera patrocinar a uno de tus animales.
        </MensajeVacio>
      )}
      {visibles.map((notificacion) => {
        const esNueva = notificacion.nueva || !notificacion.leida
        const suTema = temaDe(notificacion.tema)
        return (
          <article
            key={notificacion.id}
            className={`revelar bg-surface-container-lowest rounded-2xl shadow-sm p-space-md flex items-start gap-space-md border-l-4 ${esNueva ? 'border-tertiary' : 'border-transparent'}`}
          >
            <div className="w-10 h-10 shrink-0 rounded-full bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center">
              <Icono nombre={suTema.icono} clase="text-[20px]" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-body-md text-body-md text-on-surface">{notificacion.texto}</p>
              <p className="font-label-md text-label-md text-on-surface-variant">
                {suTema.nombre} · {formatearFecha(notificacion.fecha)}
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
