import { aprobarAnimal, aprobarCambios, rechazarAnimal, rechazarCambios } from '../../services/animales'
import { useSesion } from '../../hooks/useSesion'
import { ponerEn, sacarDe } from '../../utils/listas'
import EstadoCarga from '../comunes/EstadoCarga'
import MensajeVacio from '../comunes/MensajeVacio'
import TituloSeccion from '../comunes/TituloSeccion'
import RevisionPublicacion from './RevisionPublicacion'
import TablaCambios from './TablaCambios'

const SeccionPublicaciones = ({ pendientes, setPublicaciones, cambios, setCambios, cargando, error, onError }) => {
  const { token } = useSesion()
  const resolver = (pedido, alTerminar) => {
    onError(null)
    pedido.then(alTerminar).catch((falla) => {
      onError(falla.message)
    })
  }

  const aprobarNueva = (idAnimal) =>
    resolver(aprobarAnimal(token, idAnimal), (aprobado) => {
      setPublicaciones((actuales) => ponerEn(actuales, aprobado))
    })

  const rechazarNueva = (idAnimal, motivo) =>
    resolver(rechazarAnimal(token, idAnimal, motivo), () => {
      setPublicaciones((actuales) => sacarDe(actuales, idAnimal))
    })

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
