import { aprobarAnimal, rechazarAnimal } from '../../services/animales'
import { sacarDe } from '../../utils/listas'
import EstadoCarga from '../comunes/EstadoCarga'
import MensajeVacio from '../comunes/MensajeVacio'
import EncabezadoLista from './EncabezadoLista'
import RevisionPublicacion from './RevisionPublicacion'

// Sección "Publicaciones" del administrador: los animales que publicaron los refugios y esperan su aprobación.
// Al aprobar uno aparece en el catálogo; al rechazarlo la publicación queda eliminada. En los dos casos
// el refugio recibe una notificación (al rechazar, con el motivo si se escribió uno).
// "pendientes" las pide SeccionesAdmin (así el menú puede mostrar cuántas hay); cada acción las actualiza con setPendientes.
const SeccionPublicaciones = ({ pendientes, setPendientes, cargando, error, onError }) => {
  // Aprobada o rechazada, deja de estar pendiente
  const resolver = (pedido, idAnimal) => {
    onError(null)
    pedido
      .then(() => {
        setPendientes((actuales) => sacarDe(actuales, idAnimal))
      })
      .catch((falla) => {
        onError(falla.message)
      })
  }

  if (cargando || error) {
    return <EstadoCarga cargando={cargando} error={error} texto="Cargando las publicaciones…" />
  }

  return (
    <section className="space-y-space-md">
      <EncabezadoLista titulo="Publicaciones por aprobar" nombre="publicaciones" mostrando={pendientes.length} total={pendientes.length} />

      {pendientes.length === 0 && (
        <MensajeVacio clase="bg-surface-container rounded-2xl p-space-lg">No hay publicaciones esperando tu aprobación.</MensajeVacio>
      )}
      {pendientes.map((animal) => (
        <RevisionPublicacion
          key={animal.id}
          animal={animal}
          onAprobar={() => resolver(aprobarAnimal(animal.id), animal.id)}
          onRechazar={(motivo) => resolver(rechazarAnimal(animal.id, motivo), animal.id)}
        />
      ))}
    </section>
  )
}

export default SeccionPublicaciones
