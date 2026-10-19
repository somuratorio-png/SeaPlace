import { aprobarAnimal, aprobarCambios, rechazarAnimal, rechazarCambios } from '../../services/animales'
import { useSesion } from '../../hooks/useSesion'
import { ponerEn, sacarDe } from '../../utils/listas'
import EstadoCarga from '../comunes/EstadoCarga'
import MensajeVacio from '../comunes/MensajeVacio'
import TituloSeccion from '../comunes/TituloSeccion'
import RevisionPublicacion from './RevisionPublicacion'
import TablaCambios from './TablaCambios'

// Sección "Publicaciones" del administrador, con lo que los refugios mandaron a revisar:
// - las publicaciones nuevas: al aprobarlas aparecen en el catálogo; al rechazarlas quedan eliminadas.
// - los cambios que pidieron sobre publicaciones ya aprobadas: al aprobarlos se aplican; al rechazarlos
//   la publicación queda como estaba.
// En todos los casos el refugio recibe una notificación (al rechazar, con el motivo si se escribió uno).
// Las listas las pide SeccionesAdmin (así el menú puede mostrar cuántas hay): "pendientes" son las publicaciones
// en estado PENDIENTE, así que cada acción actualiza las publicaciones y los cambios, sin volver a pedirlos.
const SeccionPublicaciones = ({ pendientes, setPublicaciones, cambios, setCambios, cargando, error, onError }) => {
  const { token } = useSesion()
  // Con lo que contesta el backend se actualiza el estado (alTerminar); si falla, se muestra el mensaje
  const resolver = (pedido, alTerminar) => {
    onError(null)
    pedido.then(alTerminar).catch((falla) => {
      onError(falla.message)
    })
  }

  // Aprobada, la publicación queda como la devuelve el backend (ACTIVA); rechazada, se quita
  const aprobarNueva = (idAnimal) =>
    resolver(aprobarAnimal(token, idAnimal), (aprobado) => {
      setPublicaciones((actuales) => ponerEn(actuales, aprobado))
    })

  const rechazarNueva = (idAnimal, motivo) =>
    resolver(rechazarAnimal(token, idAnimal, motivo), () => {
      setPublicaciones((actuales) => sacarDe(actuales, idAnimal))
    })

  // Con los cambios aprobados o rechazados, el pedido sale de la lista y el animal queda como lo devuelve el backend
  const resolverCambios = (pedido, idAnimal) =>
    resolver(pedido, (animal) => {
      setCambios((actuales) => actuales.filter((cambio) => cambio.animal.id !== idAnimal))
      setPublicaciones((actuales) => ponerEn(actuales, animal))
    })

  if (cargando || error) {
    return <EstadoCarga cargando={cargando} error={error} texto="Cargando las publicaciones…" />
  }

  return (
    <section className="space-y-space-lg">
      <div className="space-y-space-md">
        <TituloSeccion>Publicaciones nuevas</TituloSeccion>
        {pendientes.length === 0 && (
          <MensajeVacio clase="bg-surface-container rounded-2xl p-space-lg">No hay publicaciones nuevas esperando tu aprobación.</MensajeVacio>
        )}
        {pendientes.map((animal) => (
          <RevisionPublicacion
            key={animal.id}
            animal={animal}
            onAprobar={() => aprobarNueva(animal.id)}
            onRechazar={(motivo) => rechazarNueva(animal.id, motivo)}
          />
        ))}
      </div>

      <div className="space-y-space-md">
        <TituloSeccion>Cambios en publicaciones</TituloSeccion>
        {cambios.length === 0 && <MensajeVacio clase="bg-surface-container rounded-2xl p-space-lg">No hay cambios esperando tu aprobación.</MensajeVacio>}
        {cambios.map(({ animal, cambios: campos }) => (
          <RevisionPublicacion
            key={animal.id}
            animal={animal}
            textoAprobar="Aprobar cambios"
            tituloRechazo={`¿Rechazar los cambios de ${animal.nombre}?`}
            mensajeRechazo="La publicación queda como está y el refugio recibe una notificación. Si querés, contale por qué."
            onAprobar={() => resolverCambios(aprobarCambios(token, animal.id), animal.id)}
            onRechazar={(motivo) => resolverCambios(rechazarCambios(token, animal.id, motivo), animal.id)}
          >
            <TablaCambios cambios={campos} />
          </RevisionPublicacion>
        ))}
      </div>
    </section>
  )
}

export default SeccionPublicaciones
