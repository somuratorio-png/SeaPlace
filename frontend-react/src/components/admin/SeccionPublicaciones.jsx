import { useDispatch, useSelector } from 'react-redux'
import { aprobarAnimal, aprobarCambios, rechazarAnimal, rechazarCambios } from '../../Redux/animalesSlice'
import { intentar } from '../../utils/intentar'
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
// Las listas las pide SeccionesAdmin y se leen del estado global: "pendientes" son las publicaciones en estado
// PENDIENTE. Cada acción actualiza el estado global con lo que contesta el backend (ver animalesSlice).
const SeccionPublicaciones = ({ onError }) => {
  const dispatch = useDispatch()
  const { publicaciones, cambiosPendientes: cambios, loading: cargando, error } = useSelector((state) => state.animales)
  const pendientes = publicaciones.filter((animal) => animal.publicacion === 'PENDIENTE')

  // Si la acción falla, se muestra el mensaje arriba de la página
  const resolver = (accion) => {
    onError(null)
    intentar(dispatch(accion), onError)
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
            onAprobar={() => resolver(aprobarAnimal(animal.id))}
            onRechazar={(motivo) => resolver(rechazarAnimal({ idAnimal: animal.id, motivo }))}
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
            onAprobar={() => resolver(aprobarCambios(animal.id))}
            onRechazar={(motivo) => resolver(rechazarCambios({ idAnimal: animal.id, motivo }))}
          >
            <TablaCambios cambios={campos} />
          </RevisionPublicacion>
        ))}
      </div>
    </section>
  )
}

export default SeccionPublicaciones
