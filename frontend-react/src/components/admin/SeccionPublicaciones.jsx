import { aprobarAnimal, aprobarCambios, rechazarAnimal, rechazarCambios } from '../../services/animales'
import { useSesion } from '../../hooks/useSesion'
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
// Las dos listas las pide SeccionesAdmin (así el menú puede mostrar cuántas hay); cada acción las actualiza.
const SeccionPublicaciones = ({ pendientes, setPendientes, cambios, setCambios, cargando, error, onError }) => {
  const { token } = useSesion()
  // Lo que se resolvió (aprobado o rechazado) sale de su lista
  const resolver = (pedido, setLista, idAnimal) => {
    onError(null)
    pedido
      .then(() => {
        setLista((actuales) => actuales.filter((elemento) => (elemento.animal ?? elemento).id !== idAnimal))
      })
      .catch((falla) => {
        onError(falla.message)
      })
  }

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
            onAprobar={() => resolver(aprobarAnimal(token, animal.id), setPendientes, animal.id)}
            onRechazar={(motivo) => resolver(rechazarAnimal(token, animal.id, motivo), setPendientes, animal.id)}
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
            onAprobar={() => resolver(aprobarCambios(token, animal.id), setCambios, animal.id)}
            onRechazar={(motivo) => resolver(rechazarCambios(token, animal.id, motivo), setCambios, animal.id)}
          >
            <TablaCambios cambios={campos} />
          </RevisionPublicacion>
        ))}
      </div>
    </section>
  )
}

export default SeccionPublicaciones
